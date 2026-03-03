package com.iawes.backend.service;

import com.iawes.backend.dto.user.DepartmentDto;
import com.iawes.backend.dto.user.NotificationDto;
import com.iawes.backend.dto.user.UpdateProfileRequest;
import com.iawes.backend.dto.user.UserDto;
import com.iawes.backend.entity.Department;
import com.iawes.backend.entity.Notification;
import com.iawes.backend.entity.User;
import com.iawes.backend.exception.ApiException;
import com.iawes.backend.mapper.UserMapper;
import com.iawes.backend.repository.DepartmentRepository;
import com.iawes.backend.repository.NotificationRepository;
import com.iawes.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserDto getMyProfile() {
        return userMapper.toDto(currentUserService.getCurrentUser());
    }

    public UserDto updateMyProfile(UpdateProfileRequest request) {
        User user = currentUserService.getCurrentUser();
        Department department = departmentRepository.findByNameIgnoreCase(request.getDepartment())
                .orElseGet(() -> departmentRepository.save(Department.builder().name(request.getDepartment()).build()));

        user.setName(request.getName());
        user.setDepartment(department);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userMapper.toDto(userRepository.save(user));
    }

    public List<UserDto> allUsers() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    public List<DepartmentDto> allDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> DepartmentDto.builder().id(d.getId()).name(d.getName()).build())
                .toList();
    }

    public DepartmentDto addDepartment(String name) {
        Department dep = departmentRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> departmentRepository.save(Department.builder().name(name).build()));
        return DepartmentDto.builder().id(dep.getId()).name(dep.getName()).build();
    }

    public void notifyUser(User user, String message) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .message(message)
                .readStatus(false)
                .createdAt(Instant.now())
                .build());
    }

    public List<NotificationDto> myNotifications() {
        User user = currentUserService.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(n -> NotificationDto.builder()
                        .id(n.getId())
                        .userId(n.getUser().getId())
                        .message(n.getMessage())
                        .readStatus(n.getReadStatus())
                        .createdAt(n.getCreatedAt())
                        .build())
                .toList();
    }

    public void markNotificationRead(Long id) {
        User me = currentUserService.getCurrentUser();
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notification not found."));
        if (!n.getUser().getId().equals(me.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed.");
        }
        n.setReadStatus(true);
        notificationRepository.save(n);
    }
}
