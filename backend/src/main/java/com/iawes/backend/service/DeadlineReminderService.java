package com.iawes.backend.service;

import com.iawes.backend.entity.Assignment;
import com.iawes.backend.entity.enums.AssignmentStatus;
import com.iawes.backend.entity.enums.Role;
import com.iawes.backend.repository.AssignmentRepository;
import com.iawes.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeadlineReminderService {
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Scheduled(cron = "0 0 * * * *")
    public void sendDeadlineReminders() {
        LocalDateTime now = LocalDateTime.now();
        for (Assignment assignment : assignmentRepository.findAll()) {
            if (assignment.getStatus() != AssignmentStatus.PUBLISHED) continue;
            long hours = Duration.between(now, assignment.getDeadline()).toHours();
            if (hours > 0 && hours <= 24) {
                userRepository.findByRole(Role.ROLE_STUDENT).forEach(student ->
                        userService.notifyUser(student, "Reminder: " + assignment.getTitle() + " deadline is within 24 hours."));
            }
        }
    }
}
