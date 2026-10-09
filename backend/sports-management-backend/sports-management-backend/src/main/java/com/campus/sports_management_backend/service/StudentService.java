package com.campus.sports_management_backend.service;

import com.campus.sports_management_backend.dto.BlockStudentRequest;
import com.campus.sports_management_backend.dto.StudentRegistrationRequest;
import com.campus.sports_management_backend.entity.Student;
import com.campus.sports_management_backend.exception.BadRequestException;
import com.campus.sports_management_backend.exception.ResourceNotFoundException;
import com.campus.sports_management_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final EmailValidator emailValidator;

    public StudentService(StudentRepository studentRepository, EmailValidator emailValidator) {
        this.studentRepository = studentRepository;
        this.emailValidator = emailValidator;
    }

    @Transactional
    public Student registerStudent(StudentRegistrationRequest request) {
        if (request.getEmail() == null) {
            throw new BadRequestException("Registration failed: Email address is required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        // 1. Verify college email domain using authoritative EmailValidator
        if (!emailValidator.isValidCollegeEmail(email)) {
            throw new BadRequestException("Registration failed: College email must end with @" + emailValidator.getAllowedDomain());
        }

        // 2. Prevent duplicate registrations
        if (studentRepository.existsByEmail(email)) {
            throw new BadRequestException("Student with email " + email + " is already registered.");
        }

        String phone = request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : "";
        if (studentRepository.existsByPhoneNumber(phone)) {
            throw new BadRequestException("Student with phone number " + phone + " is already registered.");
        }

        // 3. Generate unique student ID (STU + 6 digit number)
        String studentId;
        Random random = new Random();
        do {
            int num = 100000 + random.nextInt(900000);
            studentId = "STU" + num;
        } while (studentRepository.existsByStudentId(studentId));

        Student student = new Student();
        student.setStudentId(studentId);
        student.setFullName(request.getFullName().trim());
        student.setBranch(request.getBranch().trim());
        student.setSection(request.getSection().trim());
        student.setPhoneNumber(phone);
        student.setEmail(email);
        student.setBlocked(false);
        student.setCreatedAt(LocalDateTime.now());

        return studentRepository.save(student);
    }

    public Student getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getBlockedStudents() {
        return studentRepository.findByIsBlocked(true);
    }

    @Transactional
    public Student blockStudent(BlockStudentRequest request) {
        Student student = getStudentByStudentId(request.getStudentId());
        student.setBlocked(true);
        student.setBlockReason(request.getReason());
        student.setBlockedAt(LocalDateTime.now());
        student.setBlockedBy(request.getAdminId());
        return studentRepository.save(student);
    }

    @Transactional
    public Student unblockStudent(String studentId) {
        Student student = getStudentByStudentId(studentId);
        student.setBlocked(false);
        student.setBlockReason(null);
        student.setBlockedAt(null);
        student.setBlockedBy(null);
        return studentRepository.save(student);
    }

    public long countBlockedStudents() {
        return studentRepository.countByIsBlocked(true);
    }

    public long countTotalStudents() {
        return studentRepository.count();
    }
}
