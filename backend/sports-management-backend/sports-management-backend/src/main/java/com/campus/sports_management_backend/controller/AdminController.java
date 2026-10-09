package com.campus.sports_management_backend.controller;

import com.campus.sports_management_backend.dto.DashboardStatsResponse;
import com.campus.sports_management_backend.entity.Administrator;
import com.campus.sports_management_backend.repository.AdministratorRepository;
import com.campus.sports_management_backend.repository.SportRepository;
import com.campus.sports_management_backend.service.EquipmentService;
import com.campus.sports_management_backend.service.EventService;
import com.campus.sports_management_backend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final StudentService studentService;
    private final SportRepository sportRepository;
    private final EquipmentService equipmentService;
    private final EventService eventService;
    private final AdministratorRepository administratorRepository;

    public AdminController(StudentService studentService,
                           SportRepository sportRepository,
                           EquipmentService equipmentService,
                           EventService eventService,
                           AdministratorRepository administratorRepository) {
        this.studentService = studentService;
        this.sportRepository = sportRepository;
        this.equipmentService = equipmentService;
        this.eventService = eventService;
        this.administratorRepository = administratorRepository;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalStudents(studentService.countTotalStudents());
        stats.setTotalSports(sportRepository.count());
        stats.setTotalEquipment(equipmentService.countTotalEquipment());
        stats.setAvailableEquipment(equipmentService.countAvailableEquipment());
        stats.setIssuedEquipment(equipmentService.countIssuedEquipment());
        stats.setUpcomingEvents(eventService.countUpcomingEvents());
        stats.setBlockedStudents(studentService.countBlockedStudents());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/admin/list")
    public ResponseEntity<List<Administrator>> getAdministrators() {
        return ResponseEntity.ok(administratorRepository.findAll());
    }
}
