package com.iawes.backend.repository;

import com.iawes.backend.entity.Submission;
import com.iawes.backend.entity.SubmissionRubricScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRubricScoreRepository extends JpaRepository<SubmissionRubricScore, Long> {
    List<SubmissionRubricScore> findBySubmission(Submission submission);
    void deleteBySubmission(Submission submission);
}
