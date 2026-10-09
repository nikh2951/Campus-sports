package com.campus.sports_management_backend.controller;

import com.campus.sports_management_backend.dto.AdminVerifyRequest;
import com.campus.sports_management_backend.dto.AuthResponse;
import com.campus.sports_management_backend.dto.GoogleAuthRequest;
import com.campus.sports_management_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.verifyGoogleAuth(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/verify")
    public ResponseEntity<Map<String, Object>> verifyAdmin(@Valid @RequestBody AdminVerifyRequest request) {
        boolean valid = authService.verifyAdminCredentials(request.getAdminId(), request.getEmail());
        Map<String, Object> resp = new HashMap<>();
        resp.put("valid", valid);
        resp.put("adminId", request.getAdminId());
        resp.put("message", valid ? "Administrator verified successfully" : "Invalid Admin ID or Email authorization");
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getAuthConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("approvedDomain", authService.getApprovedCollegeDomain());
        return ResponseEntity.ok(config);
    }
}
