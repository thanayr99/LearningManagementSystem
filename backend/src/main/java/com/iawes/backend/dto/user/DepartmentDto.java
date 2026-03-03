package com.iawes.backend.dto.user;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DepartmentDto {
    Long id;
    String name;
}
