package com.iawes.backend.service;

import com.iawes.backend.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    private static final List<String> ALLOWED_EXT = List.of(".pdf", ".txt", ".doc", ".docx", ".md");

    @Value("${app.uploads.dir}")
    private String uploadDir;

    public String save(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Uploaded file is empty.");
            }
            Path dir = Paths.get(uploadDir);
            if (!Files.exists(dir)) Files.createDirectories(dir);
            String sanitized = file.getOriginalFilename() == null ? "submission.bin" : file.getOriginalFilename().replaceAll("\\s+", "_");
            String lower = sanitized.toLowerCase();
            boolean allowed = ALLOWED_EXT.stream().anyMatch(lower::endsWith);
            if (!allowed) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Unsupported file type.");
            }
            String name = UUID.randomUUID() + "_" + sanitized;
            Path target = dir.resolve(name);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/api/files/" + name;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file.");
        }
    }
}
