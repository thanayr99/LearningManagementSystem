package com.iawes.backend.dto.user;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class NotificationDto {
    Long id;
    Long userId;
    String message;
    Boolean readStatus;
    Instant createdAt;
}
