package com.iawes.backend.dto.user;

import com.iawes.backend.entity.enums.Role;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class UserDto {
    Long id;
    String name;
    String email;
    Role role;
    String department;
    Instant createdAt;
}
