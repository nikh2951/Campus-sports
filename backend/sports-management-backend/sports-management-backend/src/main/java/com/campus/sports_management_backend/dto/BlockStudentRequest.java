package com.campus.sports_management_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class BlockStudentRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Reason for blocking is required")
    private String reason;

    @NotBlank(message = "Admin ID is required")
    private String adminId;

    public BlockStudentRequest() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
}
