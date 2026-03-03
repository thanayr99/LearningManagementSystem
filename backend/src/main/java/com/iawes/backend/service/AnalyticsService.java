package com.iawes.backend.service;

import com.iawes.backend.dto.analytics.StudentAnalyticsResponse;
import com.iawes.backend.dto.analytics.TeacherAnalyticsResponse;
import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.Submission;
import com.iawes.backend.entity.User;
import com.iawes.backend.entity.enums.SubmissionStatus;
import com.iawes.backend.repository.AssignmentRepository;
import com.iawes.backend.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final CurrentUserService currentUserService;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;

    public TeacherAnalyticsResponse teacherAnalytics() {
        User teacher = currentUserService.getCurrentUser();
        List<Assignment> assignments = assignmentRepository.findByCreatedBy(teacher);
        List<Submission> allSubs = assignments.stream()
                .flatMap(a -> submissionRepository.findByAssignmentOrderBySubmittedAtDesc(a).stream())
                .toList();
        long pending = allSubs.stream().filter(s -> s.getStatus() != SubmissionStatus.GRADED).count();
        List<Submission> graded = allSubs.stream().filter(s -> s.getStatus() == SubmissionStatus.GRADED).toList();

        List<TeacherAnalyticsResponse.AssignmentAverageDto> avg = assignments.stream().map(a -> {
            List<Submission> forAssignment = graded.stream().filter(s -> s.getAssignment().getId().equals(a.getId())).toList();
            double average = forAssignment.isEmpty() ? 0d : forAssignment.stream().mapToDouble(s -> s.getTotalMarks() == null ? 0 : s.getTotalMarks()).average().orElse(0);
            return TeacherAnalyticsResponse.AssignmentAverageDto.builder()
                    .assignment(a.getTitle())
                    .averageMarks(Math.round(average * 100d) / 100d)
                    .build();
        }).toList();

        Map<User, List<Submission>> byStudent = graded.stream().collect(Collectors.groupingBy(Submission::getStudent));
        List<TeacherAnalyticsResponse.AtRiskStudentDto> atRisk = byStudent.entrySet().stream()
                .map(e -> Map.entry(e.getKey(), e.getValue().stream().mapToDouble(s -> s.getTotalMarks() == null ? 0 : s.getTotalMarks()).average().orElse(0)))
                .filter(e -> e.getValue() < 40d)
                .map(e -> TeacherAnalyticsResponse.AtRiskStudentDto.builder()
                        .student(e.getKey().getName())
                        .average(Math.round(e.getValue() * 100d) / 100d)
                        .build())
                .toList();

        return TeacherAnalyticsResponse.builder()
                .totalAssignments(assignments.size())
                .pendingGrading(pending)
                .avgByAssignment(avg)
                .atRiskStudents(atRisk)
                .build();
    }

    public StudentAnalyticsResponse studentAnalytics() {
        User student = currentUserService.getCurrentUser();
        List<Submission> all = submissionRepository.findByStudentOrderBySubmittedAtDesc(student);
        List<Submission> graded = all.stream().filter(s -> s.getStatus() == SubmissionStatus.GRADED).toList();

        List<StudentAnalyticsResponse.TrendItemDto> trend = new ArrayList<>();
        for (int i = 0; i < graded.size(); i++) {
            Submission s = graded.get(i);
            trend.add(StudentAnalyticsResponse.TrendItemDto.builder().attempt(i + 1).marks(s.getTotalMarks()).build());
        }
        long lateCount = all.stream().filter(s -> s.getStatus() == SubmissionStatus.LATE).count();
        List<String> strengths = graded.stream().filter(s -> s.getTotalMarks() != null && s.getTotalMarks() >= 70)
                .map(s -> s.getAssignment().getSubject()).distinct().toList();
        List<String> weaknesses = graded.stream().filter(s -> s.getTotalMarks() != null && s.getTotalMarks() < 50)
                .map(s -> s.getAssignment().getSubject()).distinct().toList();

        return StudentAnalyticsResponse.builder()
                .trend(trend)
                .lateCount(lateCount)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .build();
    }
}
