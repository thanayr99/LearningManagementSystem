package com.iawes.backend.service;

import com.iawes.backend.entity.Submission;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class PlagiarismService {

    public String extractText(MultipartFile file, String fallbackText) {
        if (fallbackText != null && !fallbackText.isBlank()) return fallbackText;
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        try {
            if (contentType.contains("text")) {
                return new String(file.getBytes());
            }
            if (contentType.contains("pdf") || file.getOriginalFilename() != null && file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
                try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                    return new PDFTextStripper().getText(document);
                }
            }
        } catch (Exception ignored) {
        }
        return "";
    }

    public double maxSimilarity(String content, List<Submission> existingForAssignment) {
        double max = 0d;
        for (Submission s : existingForAssignment) {
            max = Math.max(max, cosine(content, s.getContentText()));
        }
        return Math.round(max * 10000d) / 100d;
    }

    private double cosine(String a, String b) {
        Map<String, Integer> fa = freq(tokens(a));
        Map<String, Integer> fb = freq(tokens(b));
        if (fa.isEmpty() || fb.isEmpty()) return 0d;
        Set<String> keys = new HashSet<>();
        keys.addAll(fa.keySet());
        keys.addAll(fb.keySet());
        double dot = 0, magA = 0, magB = 0;
        for (String k : keys) {
            int av = fa.getOrDefault(k, 0);
            int bv = fb.getOrDefault(k, 0);
            dot += (double) av * bv;
            magA += (double) av * av;
            magB += (double) bv * bv;
        }
        if (magA == 0 || magB == 0) return 0d;
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }

    private List<String> tokens(String text) {
        if (text == null) return List.of();
        return Arrays.stream(text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+"))
                .filter(t -> !t.isBlank())
                .toList();
    }

    private Map<String, Integer> freq(List<String> tokens) {
        Map<String, Integer> map = new HashMap<>();
        for (String t : tokens) map.put(t, map.getOrDefault(t, 0) + 1);
        return map;
    }
}
