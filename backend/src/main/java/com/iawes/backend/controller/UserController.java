package com.iawes.backend.controller;

import com.iawes.backend.dto.user.DepartmentDto;
import com.iawes.backend.dto.user.NotificationDto;
import com.iawes.backend.dto.user.UpdateProfileRequest;
import com.iawes.backend.dto.user.UserDto;
import com.iawes.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserDto me() {
        return userService.getMyProfile();
    }

    @PutMapping("/me")
    public UserDto updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateMyProfile(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<UserDto> users() {
        return userService.allUsers();
    }

    @GetMapping("/departments")
    public List<DepartmentDto> departments() {
        return userService.allDepartments();
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public DepartmentDto addDepartment(@RequestBody Map<String, String> body) {
        return userService.addDepartment(body.get("name"));
    }

    @GetMapping("/notifications")
    public List<NotificationDto> notifications() {
        return userService.myNotifications();
    }

    @PutMapping("/notifications/{id}/read")
    public void markRead(@PathVariable Long id) {
        userService.markNotificationRead(id);
    }
}
