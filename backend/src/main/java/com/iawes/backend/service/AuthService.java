package com.iawes.backend.service;

import com.iawes.backend.dto.auth.AuthResponse;
import com.iawes.backend.dto.auth.LoginRequest;
import com.iawes.backend.dto.auth.RegisterRequest;
import com.iawes.backend.entity.Department;
import com.iawes.backend.entity.User;
import com.iawes.backend.exception.ApiException;
import com.iawes.backend.mapper.UserMapper;
import com.iawes.backend.repository.DepartmentRepository;
import com.iawes.backend.repository.UserRepository;
import com.iawes.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already exists.");
        }
        Department department = departmentRepository.findByNameIgnoreCase(request.getDepartment())
                .orElseGet(() -> departmentRepository.save(Department.builder().name(request.getDepartment()).build()));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .department(department)
                .build();
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail(), Map.of("role", saved.getRole().name(), "uid", saved.getId()));
        return AuthResponse.builder().token(token).user(userMapper.toDto(saved)).build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name(), "uid", user.getId()));
        return AuthResponse.builder().token(token).user(userMapper.toDto(user)).build();
    }
}
