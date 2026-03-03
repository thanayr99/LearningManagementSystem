package com.iawes.backend.service;

import com.iawes.backend.dto.submission.AiSuggestionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiGradingService {
    public AiSuggestionResponse suggest(String content, int maxMarks) {
        String normalized = content == null ? "" : content.toLowerCase();
        List<String> keywords = List.of("analysis", "implementation", "result", "conclusion", "testing", "complexity");
        long hits = keywords.stream().filter(normalized::contains).count();
        double ratio = Math.min(1d, 0.35d + hits * 0.1d);
        double marks = Math.round(maxMarks * ratio);
        String feedback = hits >= 4
                ? "Strong technical coverage. Improve structure and concision in final sections."
                : "Basic coverage detected. Add deeper analysis and clearer evidence for stronger grading.";
        return AiSuggestionResponse.builder()
                .suggestedMarks(marks)
                .suggestedFeedback(feedback)
                .build();
    }
}
