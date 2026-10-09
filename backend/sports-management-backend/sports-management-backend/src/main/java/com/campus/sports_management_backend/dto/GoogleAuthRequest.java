package com.campus.sports_management_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {
    
    @NotBlank(message = "ID Token or credential is required")
    private String idToken;
    
    // Optional fallback email/name for local development testing mode
    private String devEmail;
    private String devName;

    public GoogleAuthRequest() {}

    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }

    public String getDevEmail() { return devEmail; }
    public void setDevEmail(String devEmail) { this.devEmail = devEmail; }

    public String getDevName() { return devName; }
    public void setDevName(String devName) { this.devName = devName; }
}
