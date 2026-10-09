package com.campus.sports_management_backend.controller;

import com.campus.sports_management_backend.dto.AssignEquipmentRequest;
import com.campus.sports_management_backend.entity.Equipment;
import com.campus.sports_management_backend.entity.EquipmentAssignment;
import com.campus.sports_management_backend.entity.Sport;
import com.campus.sports_management_backend.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    // Sports Endpoints
    @GetMapping("/sports")
    public ResponseEntity<List<Sport>> getAllSports() {
        return ResponseEntity.ok(equipmentService.getAllSports());
    }

    @GetMapping("/sports/category/{category}")
    public ResponseEntity<List<Sport>> getSportsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(equipmentService.getSportsByCategory(category));
    }

    @PostMapping("/sports")
    public ResponseEntity<Sport> createSport(@Valid @RequestBody Sport sport) {
        Sport created = equipmentService.createSport(sport);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Equipment Endpoints
    @GetMapping("/equipment")
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @GetMapping("/equipment/sport/{sportId}")
    public ResponseEntity<List<Equipment>> getEquipmentBySport(@PathVariable Long sportId) {
        return ResponseEntity.ok(equipmentService.getEquipmentBySport(sportId));
    }

    @PostMapping("/equipment")
    public ResponseEntity<Equipment> createEquipment(@RequestParam Long sportId, @Valid @RequestBody Equipment equipment) {
        Equipment created = equipmentService.createEquipment(equipment, sportId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/equipment/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipment) {
        Equipment updated = equipmentService.updateEquipment(id, equipment);
        return ResponseEntity.ok(updated);
    }

    // Assignment & Return Endpoints
    @PostMapping("/equipment/assign")
    public ResponseEntity<EquipmentAssignment> assignEquipment(@Valid @RequestBody AssignEquipmentRequest request) {
        EquipmentAssignment assignment = equipmentService.assignEquipment(request);
        return new ResponseEntity<>(assignment, HttpStatus.CREATED);
    }

    @PostMapping("/equipment/return/{assignmentId}")
    public ResponseEntity<EquipmentAssignment> returnEquipment(@PathVariable Long assignmentId) {
        EquipmentAssignment returned = equipmentService.returnEquipment(assignmentId);
        return ResponseEntity.ok(returned);
    }

    @GetMapping("/equipment/assignments")
    public ResponseEntity<List<EquipmentAssignment>> getAllAssignments() {
        return ResponseEntity.ok(equipmentService.getAllAssignments());
    }

    @GetMapping("/equipment/assignments/student/{studentId}")
    public ResponseEntity<List<EquipmentAssignment>> getStudentAssignments(@PathVariable String studentId) {
        return ResponseEntity.ok(equipmentService.getStudentAssignments(studentId));
    }
}
