package com.iawes.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iawes.backend.dto.submission.GradeSubmissionRequest;
import com.iawes.backend.dto.submission.RubricScoreDto;
import com.iawes.backend.dto.submission.SubmissionResponse;
import com.iawes.backend.entity.*;
import com.iawes.backend.entity.enums.Role;
import com.iawes.backend.entity.enums.SubmissionStatus;
import com.iawes.backend.exception.ApiException;
import com.iawes.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final CurrentUserService currentUserService;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionRubricScoreRepository submissionRubricScoreRepository;
    private final RubricCriteriaRepository rubricCriteriaRepository;
    private final GradeAuditLogRepository gradeAuditLogRepository;
    private final FileStorageService fileStorageService;
    private final PlagiarismService plagiarismService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Transactional
    public SubmissionResponse submit(Long assignmentId, MultipartFile file, String contentText) {
        User student = currentUserService.getCurrentUser();
        if (student.getRole() != Role.ROLE_STUDENT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only students can submit assignments.");
        }
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment not found."));
        if (assignment.getStatus().name().equals("CLOSED")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Assignment is closed.");
        }
        String fileUrl = fileStorageService.save(file);
        String extracted = plagiarismService.extractText(file, contentText);

        int version = submissionRepository
                .findTopByAssignmentAndStudentOrderByVersionNumberDesc(assignment, student)
                .map(s -> s.getVersionNumber() + 1)
                .orElse(1);

        boolean late = LocalDateTime.now().isAfter(assignment.getDeadline());
        int penalty = late ? Math.min(20, (int) Math.round(assignment.getMaxMarks() * 0.1)) : 0;

        List<Submission> sameAssignment = submissionRepository.findByAssignmentOrderBySubmittedAtDesc(assignment);
        double similarity = plagiarismService.maxSimilarity(extracted, sameAssignment);

        Submission submission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .fileUrl(fileUrl)
                .fileOriginalName(file.getOriginalFilename() == null ? "submission.bin" : file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .contentText(extracted)
                .submittedAt(Instant.now())
                .status(late ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED)
                .similarityScore(similarity)
                .versionNumber(version)
                .latePenaltyApplied(penalty)
                .build();
        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    public List<SubmissionResponse> mySubmissions() {
        User me = currentUserService.getCurrentUser();
        return submissionRepository.findByStudentOrderBySubmittedAtDesc(me).stream().map(this::toResponse).toList();
    }

    public List<SubmissionResponse> assignmentSubmissions(Long assignmentId) {
        User actor = currentUserService.getCurrentUser();
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment not found."));
        boolean allowed = actor.getRole() == Role.ROLE_SUPER_ADMIN
                || actor.getRole() == Role.ROLE_TA
                || assignment.getCreatedBy().getId().equals(actor.getId());
        if (!allowed) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed to view submissions for this assignment.");
        }
        return submissionRepository.findByAssignmentOrderBySubmittedAtDesc(assignment).stream().map(this::toResponse).toList();
    }

    @Transactional
    public SubmissionResponse grade(Long submissionId, GradeSubmissionRequest request) {
        User grader = currentUserService.getCurrentUser();
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Submission not found."));
        Assignment assignment = submission.getAssignment();
        boolean allowed = grader.getRole() == Role.ROLE_SUPER_ADMIN
                || grader.getRole() == Role.ROLE_TA
                || assignment.getCreatedBy().getId().equals(grader.getId());
        if (!allowed) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed to grade this submission.");
        }

        submissionRubricScoreRepository.deleteBySubmission(submission);
        List<RubricScoreDto> scoreDtos = new ArrayList<>();
        if (request.getRubricScores() != null) {
            for (GradeSubmissionRequest.RubricGradeItem item : request.getRubricScores()) {
                RubricCriteria rubric = rubricCriteriaRepository.findById(item.getRubricId())
                        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Rubric not found: " + item.getRubricId()));
                if (!rubric.getAssignment().getId().equals(assignment.getId())) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "Rubric does not belong to this assignment.");
                }
                if (item.getAwardedMarks() < 0 || item.getAwardedMarks() > rubric.getMaxMarks()) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "Rubric marks out of range for: " + rubric.getCriteriaName());
                }
                submissionRubricScoreRepository.save(SubmissionRubricScore.builder()
                        .submission(submission)
                        .rubricCriteria(rubric)
                        .awardedMarks(item.getAwardedMarks())
                        .build());
                scoreDtos.add(RubricScoreDto.builder()
                        .rubricId(rubric.getId())
                        .criteriaName(rubric.getCriteriaName())
                        .awardedMarks(item.getAwardedMarks())
                        .build());
            }
        }

        double boundedMarks = Math.max(0, Math.min(assignment.getMaxMarks(),
                request.getApprovedMarks() - submission.getLatePenaltyApplied()));
        submission.setStatus(SubmissionStatus.GRADED);
        submission.setFeedbackText(request.getFeedbackText());
        submission.setTotalMarks(boundedMarks);
        submission.setGradedAt(Instant.now());
        Submission saved = submissionRepository.save(submission);
        userService.notifyUser(saved.getStudent(), "Your submission has been graded.");
        try {
            gradeAuditLogRepository.save(GradeAuditLog.builder()
                    .submission(saved)
                    .grader(grader)
                    .action("GRADE_SUBMISSION")
                    .payload(objectMapper.writeValueAsString(Map.of(
                            "approvedMarks", boundedMarks,
                            "feedbackText", request.getFeedbackText(),
                            "rubricScores", scoreDtos
                    )))
                    .createdAt(Instant.now())
                    .build());
        } catch (JsonProcessingException ignored) {
        }
        return toResponse(saved);
    }

    public SubmissionResponse toResponse(Submission submission) {
        List<RubricScoreDto> rubricScores = submissionRubricScoreRepository.findBySubmission(submission).stream()
                .sorted(Comparator.comparing(s -> s.getRubricCriteria().getId()))
                .map(s -> RubricScoreDto.builder()
                        .rubricId(s.getRubricCriteria().getId())
                        .criteriaName(s.getRubricCriteria().getCriteriaName())
                        .awardedMarks(s.getAwardedMarks())
                        .build())
                .toList();
        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getName())
                .fileUrl(submission.getFileUrl())
                .fileOriginalName(submission.getFileOriginalName())
                .fileType(submission.getFileType())
                .fileSize(submission.getFileSize())
                .submittedAt(submission.getSubmittedAt())
                .status(submission.getStatus())
                .totalMarks(submission.getTotalMarks())
                .feedbackText(submission.getFeedbackText())
                .gradedAt(submission.getGradedAt())
                .similarityScore(submission.getSimilarityScore())
                .versionNumber(submission.getVersionNumber())
                .latePenaltyApplied(submission.getLatePenaltyApplied())
                .rubricScores(rubricScores)
                .build();
    }

    public Submission findByFilePathForAuthorizedUser(String filePath) {
        User actor = currentUserService.getCurrentUser();
        Submission submission = submissionRepository.findByFileUrl(filePath)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "File not found."));
        boolean allowed = actor.getRole() == Role.ROLE_SUPER_ADMIN
                || actor.getRole() == Role.ROLE_TA
                || submission.getStudent().getId().equals(actor.getId())
                || submission.getAssignment().getCreatedBy().getId().equals(actor.getId());
        if (!allowed) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to access this file.");
        }
        return submission;
    }
}
