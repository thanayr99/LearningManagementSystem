package com.iawes.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "submission_rubric_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionRubricScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubric_id", nullable = false)
    private RubricCriteria rubricCriteria;

    @Column(nullable = false)
    private Double awardedMarks;
}
