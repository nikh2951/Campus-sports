package com.campus.sports_management_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

@Component
public class EmailValidator {

    private static final Pattern EMAIL_SYNTAX_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");

    @Value("${app.auth.allowed-email-domain:anurag.edu.in}")
    private String allowedDomain;

    public EmailValidator() {}

    public EmailValidator(String allowedDomain) {
        this.allowedDomain = allowedDomain;
    }

    public String getAllowedDomain() {
        return allowedDomain != null && !allowedDomain.isBlank() ? allowedDomain.trim().toLowerCase() : "anurag.edu.in";
    }

    public boolean isValidCollegeEmail(String email) {
        if (email == null) {
            return false;
        }
        String trimmed = email.trim();
        if (trimmed.isEmpty()) {
            return false;
        }

        var matcher = EMAIL_SYNTAX_PATTERN.matcher(trimmed);
        if (!matcher.matches()) {
            return false;
        }

        String domainPart = matcher.group(1).toLowerCase();
        String expectedDomain = getAllowedDomain();

        // Exact match required. Rejects lookalikes such as student@anurag.edu.in.example
        return domainPart.equals(expectedDomain);
    }
}
