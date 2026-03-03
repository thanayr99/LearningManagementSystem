package com.iawes.backend.dto.auth;

import com.iawes.backend.dto.user.UserDto;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    UserDto user;
}
