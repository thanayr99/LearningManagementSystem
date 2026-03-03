package com.iawes.backend.dto.assignment;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RubricCriteriaDto {
    Long id;
    String criteriaName;
    Integer maxMarks;
}
