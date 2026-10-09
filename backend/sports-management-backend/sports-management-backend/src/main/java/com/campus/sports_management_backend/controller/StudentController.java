package com.campus.sports_management_backend.controller;

import com.campus.sports_management_backend.dto.BlockStudentRequest;
import com.campus.sports_management_backend.dto.StudentRegistrationRequest;
import com.campus.sports_management_backend.entity.Student;
import com.campus.sports_management_backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<Student> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        Student created = studentService.registerStudent(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Student> getStudentByStudentId(@PathVariable String studentId) {
        Student student = studentService.getStudentByStudentId(studentId);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        Student student = studentService.getStudentByEmail(email);
        return ResponseEntity.ok(student);
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/blocked")
    public ResponseEntity<List<Student>> getBlockedStudents() {
        return ResponseEntity.ok(studentService.getBlockedStudents());
    }

    @PostMapping("/block")
    public ResponseEntity<Student> blockStudent(@Valid @RequestBody BlockStudentRequest request) {
        Student blocked = studentService.blockStudent(request);
        return ResponseEntity.ok(blocked);
    }

    @PostMapping("/unblock/{studentId}")
    public ResponseEntity<Student> unblockStudent(@PathVariable String studentId) {
        Student unblocked = studentService.unblockStudent(studentId);
        return ResponseEntity.ok(unblocked);
    }
}
