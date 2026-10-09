package com.campus.sports_management_backend.controller;

import com.campus.sports_management_backend.dto.AchievementRequest;
import com.campus.sports_management_backend.entity.Achievement;
import com.campus.sports_management_backend.service.AchievementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<List<Achievement>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Achievement>> getStudentAchievements(@PathVariable String studentId) {
        return ResponseEntity.ok(achievementService.getAchievementsForStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Achievement> createAchievement(@Valid @RequestBody AchievementRequest request) {
        Achievement created = achievementService.createAchievement(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long id) {
        achievementService.deleteAchievement(id);
        return ResponseEntity.noContent().build();
    }
}
