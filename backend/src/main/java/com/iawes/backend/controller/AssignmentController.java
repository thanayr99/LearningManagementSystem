package com.iawes.backend.controller;

import com.iawes.backend.dto.assignment.AssignmentRequest;
import com.iawes.backend.dto.assignment.AssignmentResponse;
import com.iawes.backend.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','TA')")
    public AssignmentResponse create(@Valid @RequestBody AssignmentRequest request) {
        return assignmentService.create(request);
    }

    @GetMapping
    public List<AssignmentResponse> all() {
        return assignmentService.all();
    }

    @GetMapping("/{id}")
    public AssignmentResponse one(@PathVariable Long id) {
        return assignmentService.one(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','TA','SUPER_ADMIN')")
    public AssignmentResponse update(@PathVariable Long id, @Valid @RequestBody AssignmentRequest request) {
        return assignmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','TA','SUPER_ADMIN')")
    public void delete(@PathVariable Long id) {
        assignmentService.delete(id);
    }
}
