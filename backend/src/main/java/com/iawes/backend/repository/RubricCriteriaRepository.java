package com.iawes.backend.repository;

import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.RubricCriteria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RubricCriteriaRepository extends JpaRepository<RubricCriteria, Long> {
    List<RubricCriteria> findByAssignment(Assignment assignment);
    void deleteByAssignment(Assignment assignment);
}
