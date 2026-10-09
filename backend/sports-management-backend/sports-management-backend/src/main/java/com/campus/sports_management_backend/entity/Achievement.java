package com.campus.sports_management_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Student is required")
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sport_id")
    private Sport sport;

    private String sportName;

    @NotBlank(message = "Achievement title is required")
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Competition name is required")
    @Column(nullable = false)
    private String competition;

    @NotNull(message = "Achievement date is required")
    @Column(nullable = false)
    private LocalDate achievementDate;

    private String position; // e.g. 1st Place, Gold Medalist, Runner Up

    public Achievement() {}

    public Achievement(Student student, Sport sport, String sportName, String title, String description, String competition, LocalDate achievementDate, String position) {
        this.student = student;
        this.sport = sport;
        this.sportName = sportName;
        this.title = title;
        this.description = description;
        this.competition = competition;
        this.achievementDate = achievementDate;
        this.position = position;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Sport getSport() { return sport; }
    public void setSport(Sport sport) { this.sport = sport; }

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
