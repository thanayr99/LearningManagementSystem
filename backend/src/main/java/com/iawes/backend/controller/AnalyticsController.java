package com.iawes.backend.controller;

import com.iawes.backend.dto.analytics.StudentAnalyticsResponse;
import com.iawes.backend.dto.analytics.TeacherAnalyticsResponse;
import com.iawes.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/teacher")
    @PreAuthorize("hasAnyRole('TEACHER','TA')")
    public TeacherAnalyticsResponse teacher() {
        return analyticsService.teacherAnalytics();
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentAnalyticsResponse student() {
        return analyticsService.studentAnalytics();
    }
}
