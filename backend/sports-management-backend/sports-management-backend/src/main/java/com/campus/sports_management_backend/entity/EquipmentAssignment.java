package com.campus.sports_management_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment_assignments")
public class EquipmentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String assignmentCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Student is required")
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipment_id", nullable = false)
    @NotNull(message = "Equipment is required")
    private Equipment equipment;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String issuedByAdmin;

    @Column(nullable = false)
    private LocalDateTime issueTime = LocalDateTime.now();

    private LocalDateTime returnTime;

    @Column(nullable = false)
    private String status = "ISSUED"; // ISSUED, RETURNED

    public EquipmentAssignment() {}

    public EquipmentAssignment(String assignmentCode, Student student, Equipment equipment, Integer quantity, String issuedByAdmin) {
        this.assignmentCode = assignmentCode;
        this.student = student;
        this.equipment = equipment;
        this.quantity = quantity;
        this.issuedByAdmin = issuedByAdmin;
        this.issueTime = LocalDateTime.now();
        this.status = "ISSUED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssignmentCode() { return assignmentCode; }
    public void setAssignmentCode(String assignmentCode) { this.assignmentCode = assignmentCode; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Equipment getEquipment() { return equipment; }
    public void setEquipment(Equipment equipment) { this.equipment = equipment; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getIssuedByAdmin() { return issuedByAdmin; }
    public void setIssuedByAdmin(String issuedByAdmin) { this.issuedByAdmin = issuedByAdmin; }

    public LocalDateTime getIssueTime() { return issueTime; }
    public void setIssueTime(LocalDateTime issueTime) { this.issueTime = issueTime; }

    public LocalDateTime getReturnTime() { return returnTime; }
    public void setReturnTime(LocalDateTime returnTime) { this.returnTime = returnTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
