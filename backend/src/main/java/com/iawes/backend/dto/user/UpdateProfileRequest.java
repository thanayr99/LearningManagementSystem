package com.iawes.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank
    @Size(min = 2, max = 140)
    private String name;
    @NotBlank
    private String department;
    @NotBlank
    @Size(min = 8, max = 64, message = "Password must be 8-64 characters.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$",
            message = "Password must include upper, lower, number, and special character."
    )
    private String password;
}
