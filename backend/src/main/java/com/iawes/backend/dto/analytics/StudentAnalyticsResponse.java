package com.iawes.backend.dto.analytics;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class StudentAnalyticsResponse {
    List<TrendItemDto> trend;
    Long lateCount;
    List<String> strengths;
    List<String> weaknesses;

    @Value
    @Builder
    public static class TrendItemDto {
        Integer attempt;
        Double marks;
    }
}
