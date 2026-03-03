package com.iawes.backend.service;

import com.iawes.backend.dto.assignment.AssignmentRequest;
import com.iawes.backend.dto.assignment.AssignmentResponse;
import com.iawes.backend.dto.assignment.RubricCriteriaDto;
import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.RubricCriteria;
import com.iawes.backend.entity.User;
import com.iawes.backend.entity.enums.Role;
import com.iawes.backend.exception.ApiException;
import com.iawes.backend.repository.AssignmentRepository;
import com.iawes.backend.repository.RubricCriteriaRepository;
import com.iawes.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final RubricCriteriaRepository rubricCriteriaRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final UserService userService;

    @Transactional
    public AssignmentResponse create(AssignmentRequest request) {
        User actor = currentUserService.getCurrentUser();
        if (!(actor.getRole() == Role.ROLE_TEACHER || actor.getRole() == Role.ROLE_TA)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only teacher/TA can create assignments.");
        }
        Assignment assignment = Assignment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .subject(request.getSubject())
                .deadline(request.getDeadline())
                .maxMarks(request.getMaxMarks())
                .createdBy(actor)
                .status(request.getStatus())
                .referenceFiles(request.getReferenceFiles() != null ? request.getReferenceFiles() : new ArrayList<>())
                .build();
        Assignment saved = assignmentRepository.save(assignment);
        upsertRubric(saved, request.getRubric());
        if (saved.getStatus().name().equals("PUBLISHED")) {
            userRepository.findByRole(Role.ROLE_STUDENT).forEach(student ->
                    userService.notifyUser(student, "Assignment " + saved.getTitle() + " has been published."));
        }
        return toResponse(saved);
    }

    @Transactional
    public AssignmentResponse update(Long id, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment not found."));
        User actor = currentUserService.getCurrentUser();
        if (!assignment.getCreatedBy().getId().equals(actor.getId()) && actor.getRole() != Role.ROLE_SUPER_ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed.");
        }
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setSubject(request.getSubject());
        assignment.setDeadline(request.getDeadline());
        assignment.setMaxMarks(request.getMaxMarks());
        assignment.setStatus(request.getStatus());
        assignment.setReferenceFiles(request.getReferenceFiles() != null ? request.getReferenceFiles() : new ArrayList<>());
        Assignment saved = assignmentRepository.save(assignment);
        rubricCriteriaRepository.deleteByAssignment(saved);
        upsertRubric(saved, request.getRubric());
        return toResponse(saved);
    }

    public List<AssignmentResponse> all() {
        return assignmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public AssignmentResponse one(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment not found."));
        return toResponse(assignment);
    }

    public void delete(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment not found."));
        assignmentRepository.delete(assignment);
    }

    private void upsertRubric(Assignment assignment, List<AssignmentRequest.RubricItemRequest> rubric) {
        if (rubric == null) return;
        rubric.forEach(item -> rubricCriteriaRepository.save(RubricCriteria.builder()
                .assignment(assignment)
                .criteriaName(item.getCriteriaName())
                .maxMarks(item.getMaxMarks())
                .build()));
    }

    public AssignmentResponse toResponse(Assignment assignment) {
        List<RubricCriteriaDto> rubric = rubricCriteriaRepository.findByAssignment(assignment).stream()
                .map(r -> RubricCriteriaDto.builder()
                        .id(r.getId())
                        .criteriaName(r.getCriteriaName())
                        .maxMarks(r.getMaxMarks())
                        .build())
                .toList();
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .subject(assignment.getSubject())
                .deadline(assignment.getDeadline())
                .maxMarks(assignment.getMaxMarks())
                .createdBy(assignment.getCreatedBy().getId())
                .createdByName(assignment.getCreatedBy().getName())
                .createdAt(assignment.getCreatedAt())
                .status(assignment.getStatus())
                .referenceFiles(assignment.getReferenceFiles())
                .rubric(rubric)
                .build();
    }
}
