package com.campus.sports_management_backend.service;

import com.campus.sports_management_backend.dto.AssignEquipmentRequest;
import com.campus.sports_management_backend.entity.Equipment;
import com.campus.sports_management_backend.entity.EquipmentAssignment;
import com.campus.sports_management_backend.entity.Sport;
import com.campus.sports_management_backend.entity.Student;
import com.campus.sports_management_backend.exception.BadRequestException;
import com.campus.sports_management_backend.exception.ResourceNotFoundException;
import com.campus.sports_management_backend.repository.EquipmentAssignmentRepository;
import com.campus.sports_management_backend.repository.EquipmentRepository;
import com.campus.sports_management_backend.repository.SportRepository;
import com.campus.sports_management_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class EquipmentService {

    private final SportRepository sportRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    public EquipmentService(SportRepository sportRepository,
                            EquipmentRepository equipmentRepository,
                            EquipmentAssignmentRepository assignmentRepository,
                            StudentRepository studentRepository) {
        this.sportRepository = sportRepository;
        this.equipmentRepository = equipmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.studentRepository = studentRepository;
    }

    // Sports Operations
    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    public List<Sport> getSportsByCategory(String category) {
        return sportRepository.findByCategoryAndActive(category.toUpperCase(), true);
    }

    @Transactional
    public Sport createSport(Sport sport) {
        if (sportRepository.existsByNameIgnoreCase(sport.getName().trim())) {
            throw new BadRequestException("Sport with name '" + sport.getName() + "' already exists.");
        }
        sport.setName(sport.getName().trim());
        sport.setCategory(sport.getCategory().trim().toUpperCase());
        return sportRepository.save(sport);
    }

    // Equipment Operations
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public List<Equipment> getEquipmentBySport(Long sportId) {
        return equipmentRepository.findBySportIdAndActive(sportId, true);
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));
    }

    @Transactional
    public Equipment createEquipment(Equipment equipment, Long sportId) {
        Sport sport = sportRepository.findById(sportId)
                .orElseThrow(() -> new ResourceNotFoundException("Sport not found with ID: " + sportId));

        if (equipment.getTotalQuantity() < 0) {
            throw new BadRequestException("Total quantity cannot be negative");
        }
        if (equipment.getAvailableQuantity() == null) {
            equipment.setAvailableQuantity(equipment.getTotalQuantity());
        }
        if (equipment.getAvailableQuantity() > equipment.getTotalQuantity()) {
            throw new BadRequestException("Available quantity cannot exceed total quantity");
        }

        equipment.setSport(sport);
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment updateEquipment(Long id, Equipment updated) {
        Equipment existing = getEquipmentById(id);
        if (updated.getTotalQuantity() != null) {
            int diff = updated.getTotalQuantity() - existing.getTotalQuantity();
            existing.setTotalQuantity(updated.getTotalQuantity());
            existing.setAvailableQuantity(existing.getAvailableQuantity() + diff);
            if (existing.getAvailableQuantity() < 0) {
                existing.setAvailableQuantity(0);
            }
        }
        if (updated.getName() != null && !updated.getName().isBlank()) {
            existing.setName(updated.getName());
        }
        return equipmentRepository.save(existing);
    }

    // Assignment & Returns
    @Transactional
    public EquipmentAssignment assignEquipment(AssignEquipmentRequest request) {
        // 1. Verify Student
        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentId()));

        // 2. Check if Blocked
        if (student.isBlocked()) {
            throw new BadRequestException("Cannot assign equipment. Student " + student.getFullName() + 
                    " (" + student.getStudentId() + ") is BLOCKED. Reason: " + student.getBlockReason());
        }

        // 3. Verify Equipment
        Equipment equipment = getEquipmentById(request.getEquipmentId());
        if (!equipment.isActive()) {
            throw new BadRequestException("Selected equipment is not active.");
        }

        // 4. Verify stock quantity
        if (equipment.getAvailableQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available for " + equipment.getName() + 
                    ". Requested: " + request.getQuantity() + ", Available: " + equipment.getAvailableQuantity());
        }

        // 5. Update Inventory Available Quantity
        equipment.setAvailableQuantity(equipment.getAvailableQuantity() - request.getQuantity());
        equipmentRepository.save(equipment);

        // 6. Generate Assignment Code
        String code = "ASN-" + (10000 + new Random().nextInt(90000));
        EquipmentAssignment assignment = new EquipmentAssignment(code, student, equipment, request.getQuantity(), request.getAdminId());
        
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public EquipmentAssignment returnEquipment(Long assignmentId) {
        EquipmentAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment assignment record not found with ID: " + assignmentId));

        if ("RETURNED".equalsIgnoreCase(assignment.getStatus())) {
            throw new BadRequestException("Equipment assignment has already been returned.");
        }

        // Restore equipment available quantity
        Equipment equipment = assignment.getEquipment();
        equipment.setAvailableQuantity(equipment.getAvailableQuantity() + assignment.getQuantity());
        if (equipment.getAvailableQuantity() > equipment.getTotalQuantity()) {
            equipment.setAvailableQuantity(equipment.getTotalQuantity());
        }
        equipmentRepository.save(equipment);

        assignment.setStatus("RETURNED");
        assignment.setReturnTime(LocalDateTime.now());
        return assignmentRepository.save(assignment);
    }

    public List<EquipmentAssignment> getAllAssignments() {
        return assignmentRepository.findAllByOrderByIssueTimeDesc();
    }

    public List<EquipmentAssignment> getStudentAssignments(String studentId) {
        return assignmentRepository.findByStudentStudentId(studentId);
    }

    public long countIssuedEquipment() {
        Long issuedSum = assignmentRepository.sumCurrentlyIssuedQuantity();
        return issuedSum != null ? issuedSum : 0;
    }

    public long countTotalEquipment() {
        Long totalSum = equipmentRepository.sumTotalQuantity();
        return totalSum != null ? totalSum : 0;
    }

    public long countAvailableEquipment() {
        Long availableSum = equipmentRepository.sumAvailableQuantity();
        return availableSum != null ? availableSum : 0;
    }
}
