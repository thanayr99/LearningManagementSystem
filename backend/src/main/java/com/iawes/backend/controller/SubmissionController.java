package com.iawes.backend.controller;

import com.iawes.backend.dto.submission.AiSuggestionResponse;
import com.iawes.backend.dto.submission.GradeSubmissionRequest;
import com.iawes.backend.dto.submission.SubmissionResponse;
import com.iawes.backend.service.AiGradingService;
import com.iawes.backend.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;
    private final AiGradingService aiGradingService;

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('STUDENT')")
    public SubmissionResponse submit(@RequestParam("assignmentId") Long assignmentId,
                                     @RequestParam("file") MultipartFile file,
                                     @RequestParam(value = "contentText", required = false) String contentText) {
        return submissionService.submit(assignmentId, file, contentText);
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public List<SubmissionResponse> studentSubmissions() {
        return submissionService.mySubmissions();
    }

    @GetMapping("/assignment/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','TA','SUPER_ADMIN')")
    public List<SubmissionResponse> assignmentSubmissions(@PathVariable("id") Long assignmentId) {
        return submissionService.assignmentSubmissions(assignmentId);
    }

    @PutMapping("/grade/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','TA')")
    public SubmissionResponse grade(@PathVariable("id") Long submissionId, @RequestBody GradeSubmissionRequest request) {
        return submissionService.grade(submissionId, request);
    }

    @PostMapping("/ai-suggest")
    @PreAuthorize("hasAnyRole('TEACHER','TA')")
    public AiSuggestionResponse aiSuggest(@RequestBody Map<String, Object> body) {
        String content = String.valueOf(body.getOrDefault("content", ""));
        int maxMarks = Integer.parseInt(String.valueOf(body.getOrDefault("maxMarks", 100)));
        return aiGradingService.suggest(content, maxMarks);
    }
}
