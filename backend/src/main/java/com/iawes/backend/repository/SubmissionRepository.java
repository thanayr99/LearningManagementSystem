package com.iawes.backend.repository;

import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.Submission;
import com.iawes.backend.entity.User;
import com.iawes.backend.entity.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentOrderBySubmittedAtDesc(User student);
    List<Submission> findByAssignmentOrderBySubmittedAtDesc(Assignment assignment);
    List<Submission> findByAssignmentAndStudentOrderBySubmittedAtDesc(Assignment assignment, User student);
    long countByAssignmentInAndStatusNot(List<Assignment> assignments, SubmissionStatus status);
    Optional<Submission> findTopByAssignmentAndStudentOrderByVersionNumberDesc(Assignment assignment, User student);
    Optional<Submission> findByFileUrl(String fileUrl);
}
