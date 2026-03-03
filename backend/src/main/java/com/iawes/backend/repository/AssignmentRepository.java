package com.iawes.backend.repository;

import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCreatedBy(User createdBy);
}
