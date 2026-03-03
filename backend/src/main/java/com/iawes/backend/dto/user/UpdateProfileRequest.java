package com.iawes.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String department;
    @NotBlank
    private String password;
}
