package com.iawes.backend.dto.auth;

import com.iawes.backend.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 2, max = 140)
    private String name;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 8, max = 64, message = "Password must be 8-64 characters.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$",
            message = "Password must include upper, lower, number, and special character."
    )
    private String password;
    @NotNull
    private Role role;
    @NotBlank
    private String department;
}
