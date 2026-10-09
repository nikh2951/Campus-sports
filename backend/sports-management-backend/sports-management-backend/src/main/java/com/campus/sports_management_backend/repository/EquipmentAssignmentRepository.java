package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.EquipmentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentAssignmentRepository extends JpaRepository<EquipmentAssignment, Long> {
    Optional<EquipmentAssignment> findByAssignmentCode(String assignmentCode);
    List<EquipmentAssignment> findByStudentStudentId(String studentId);
    List<EquipmentAssignment> findByStatus(String status);
    List<EquipmentAssignment> findAllByOrderByIssueTimeDesc();
    
    @Query("SELECT COUNT(ea) FROM EquipmentAssignment ea WHERE ea.status = 'ISSUED'")
    long countCurrentlyIssued();
    
    @Query("SELECT SUM(ea.quantity) FROM EquipmentAssignment ea WHERE ea.status = 'ISSUED'")
    Long sumCurrentlyIssuedQuantity();
}
