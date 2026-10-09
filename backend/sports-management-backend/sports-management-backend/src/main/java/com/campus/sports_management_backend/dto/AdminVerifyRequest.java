package com.campus.sports_management_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminVerifyRequest {

    @NotBlank(message = "Admin ID is required")
    private String adminId;

    private String email;

    public AdminVerifyRequest() {}

    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
