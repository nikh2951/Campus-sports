package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByStudentId(String studentId);
    List<Student> findByIsBlocked(boolean isBlocked);
    long countByIsBlocked(boolean isBlocked);
}
