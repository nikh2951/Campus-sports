package com.campus.sports_management_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Equipment name is required")
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sport_id", nullable = false)
    @NotNull(message = "Associated sport is required")
    private Sport sport;

    @NotNull(message = "Total quantity is required")
    @Min(value = 0, message = "Total quantity cannot be negative")
    @Column(nullable = false)
    private Integer totalQuantity;

    @NotNull(message = "Available quantity is required")
    @Min(value = 0, message = "Available quantity cannot be negative")
    @Column(nullable = false)
    private Integer availableQuantity;

    @Column(nullable = false)
    private boolean active = true;

    public Equipment() {}

    public Equipment(String name, Sport sport, Integer totalQuantity, Integer availableQuantity) {
        this.name = name;
        this.sport = sport;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = availableQuantity;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Sport getSport() { return sport; }
    public void setSport(Sport sport) { this.sport = sport; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
