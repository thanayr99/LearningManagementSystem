package com.iawes.backend.dto.submission;

import com.iawes.backend.entity.enums.SubmissionStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class SubmissionResponse {
    Long id;
    Long assignmentId;
    Long studentId;
    String studentName;
    String fileUrl;
    String fileOriginalName;
    String fileType;
    Long fileSize;
    Instant submittedAt;
    SubmissionStatus status;
    Double totalMarks;
    String feedbackText;
    Instant gradedAt;
    Double similarityScore;
    Integer versionNumber;
    Integer latePenaltyApplied;
    List<RubricScoreDto> rubricScores;
}
