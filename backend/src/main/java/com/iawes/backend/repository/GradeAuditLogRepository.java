package com.iawes.backend.repository;

import com.iawes.backend.entity.GradeAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeAuditLogRepository extends JpaRepository<GradeAuditLog, Long> {
}
