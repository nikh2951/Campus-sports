package com.campus.sports_management_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "sports")
public class Sport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Sport name is required")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Category is required (INDOOR / OUTDOOR)")
    @Column(nullable = false)
    private String category; // INDOOR or OUTDOOR

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    public Sport() {}

    public Sport(String name, String category, String description) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
