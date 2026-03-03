package com.iawes.backend.dto.submission;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AiSuggestionResponse {
    Double suggestedMarks;
    String suggestedFeedback;
}
