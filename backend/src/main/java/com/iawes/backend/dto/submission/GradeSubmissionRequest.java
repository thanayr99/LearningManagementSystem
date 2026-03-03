package com.iawes.backend.dto.submission;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class GradeSubmissionRequest {
    @NotNull
    private Double approvedMarks;
    private String feedbackText;
    private List<RubricGradeItem> rubricScores;

    @Data
    public static class RubricGradeItem {
        @NotNull
        private Long rubricId;
        @NotNull
        private Double awardedMarks;
    }
}
