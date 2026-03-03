package com.iawes.backend.dto.analytics;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class TeacherAnalyticsResponse {
    Integer totalAssignments;
    Long pendingGrading;
    List<AssignmentAverageDto> avgByAssignment;
    List<AtRiskStudentDto> atRiskStudents;

    @Value
    @Builder
    public static class AssignmentAverageDto {
        String assignment;
        Double averageMarks;
    }

    @Value
    @Builder
    public static class AtRiskStudentDto {
        String student;
        Double average;
    }
}
