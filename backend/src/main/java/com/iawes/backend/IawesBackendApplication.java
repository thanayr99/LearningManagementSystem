package com.iawes.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IawesBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(IawesBackendApplication.class, args);
    }
}
