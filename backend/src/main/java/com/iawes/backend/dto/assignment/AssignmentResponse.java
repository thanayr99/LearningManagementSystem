package com.iawes.backend.dto.assignment;

import com.iawes.backend.entity.enums.AssignmentStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder
public class AssignmentResponse {
    Long id;
    String title;
    String description;
    String subject;
    LocalDateTime deadline;
    Integer maxMarks;
    Long createdBy;
    String createdByName;
    Instant createdAt;
    AssignmentStatus status;
    List<String> referenceFiles;
    List<RubricCriteriaDto> rubric;
}
