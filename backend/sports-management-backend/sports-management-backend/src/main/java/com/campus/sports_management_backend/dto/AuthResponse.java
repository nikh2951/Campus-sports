package com.campus.sports_management_backend.dto;

import com.campus.sports_management_backend.entity.Administrator;
import com.campus.sports_management_backend.entity.Student;

public class AuthResponse {
    private boolean success;
    private String message;
    private String email;
    private String name;
    private String picture;
    private boolean registeredStudent;
    private Student student;
    private boolean admin;
    private Administrator administrator;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, String email, String name) {
        this.success = success;
        this.message = message;
        this.email = email;
        this.name = name;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public boolean isRegisteredStudent() { return registeredStudent; }
    public void setRegisteredStudent(boolean registeredStudent) { this.registeredStudent = registeredStudent; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public boolean isAdmin() { return admin; }
    public void setAdmin(boolean admin) { this.admin = admin; }

    public Administrator getAdministrator() { return administrator; }
    public void setAdministrator(Administrator administrator) { this.administrator = administrator; }
}
