package com.iawes.backend.dto.submission;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RubricScoreDto {
    Long rubricId;
    String criteriaName;
    Double awardedMarks;
}
