package com.campus.sports_management_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    private final DataSource dataSource;

    public RootController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "UP");
        resp.put("service", "Campus Sports Management System API");
        resp.put("version", "1.0.0");
        resp.put("timestamp", LocalDateTime.now().toString());

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("health", "/api/health");
        endpoints.put("authConfig", "/api/auth/config");
        endpoints.put("sports", "/api/sports");
        endpoints.put("events", "/api/events");
        resp.put("endpoints", endpoints);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "UP");
        resp.put("timestamp", LocalDateTime.now().toString());

        boolean dbConnected = false;
        try (Connection conn = dataSource.getConnection()) {
            dbConnected = conn.isValid(2);
        } catch (Exception e) {
            dbConnected = false;
            resp.put("dbError", e.getMessage());
        }
        resp.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");

        return ResponseEntity.ok(resp);
    }
}
