package com.iawes.backend.entity;

import com.iawes.backend.entity.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false, length = 260)
    private String fileUrl;

    @Column(nullable = false, length = 260)
    private String fileOriginalName;

    @Column(length = 140)
    private String fileType;

    private Long fileSize;

    @Lob
    private String contentText;

    @Column(nullable = false)
    private Instant submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SubmissionStatus status;

    private Double totalMarks;

    @Column(columnDefinition = "TEXT")
    private String feedbackText;

    private Instant gradedAt;

    @Column(nullable = false)
    private Double similarityScore;

    @Column(nullable = false)
    private Integer versionNumber;

    @Column(nullable = false)
    private Integer latePenaltyApplied;
}
