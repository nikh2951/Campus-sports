package com.campus.sports_management_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AchievementRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private Long sportId;
    private String sportName;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Competition name is required")
    private String competition;

    @NotNull(message = "Achievement date is required")
    private LocalDate achievementDate;

    private String position;

    public AchievementRequest() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public Long getSportId() { return sportId; }
    public void setSportId(Long sportId) { this.sportId = sportId; }

    public String getSportName() { return sportName; }
    public void setSportName(String sportName) { this.sportName = sportName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompetition() { return competition; }
    public void setCompetition(String competition) { this.competition = competition; }

    public LocalDate getAchievementDate() { return achievementDate; }
    public void setAchievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
}
