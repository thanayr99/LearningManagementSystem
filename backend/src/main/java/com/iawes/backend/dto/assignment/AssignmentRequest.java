package com.iawes.backend.dto.assignment;

import com.iawes.backend.entity.enums.AssignmentStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignmentRequest {
    @NotBlank
    private String title;
    private String description;
    @NotBlank
    private String subject;
    @NotNull
    private LocalDateTime deadline;
    @NotNull
    @Min(1)
    private Integer maxMarks;
    @NotNull
    private AssignmentStatus status;
    private List<String> referenceFiles;
    private List<RubricItemRequest> rubric;

    @Data
    public static class RubricItemRequest {
        private Long id;
        @NotBlank
        private String criteriaName;
        @NotNull
        @Min(1)
        private Integer maxMarks;
    }
}
