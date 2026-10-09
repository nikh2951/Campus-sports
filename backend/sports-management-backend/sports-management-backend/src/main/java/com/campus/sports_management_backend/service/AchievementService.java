package com.campus.sports_management_backend.service;

import com.campus.sports_management_backend.dto.AchievementRequest;
import com.campus.sports_management_backend.entity.Achievement;
import com.campus.sports_management_backend.entity.Sport;
import com.campus.sports_management_backend.entity.Student;
import com.campus.sports_management_backend.exception.ResourceNotFoundException;
import com.campus.sports_management_backend.repository.AchievementRepository;
import com.campus.sports_management_backend.repository.SportRepository;
import com.campus.sports_management_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final StudentRepository studentRepository;
    private final SportRepository sportRepository;

    public AchievementService(AchievementRepository achievementRepository,
                              StudentRepository studentRepository,
                              SportRepository sportRepository) {
        this.achievementRepository = achievementRepository;
        this.studentRepository = studentRepository;
        this.sportRepository = sportRepository;
    }

    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAllByOrderByAchievementDateDesc();
    }

    public List<Achievement> getAchievementsForStudent(String studentId) {
        return achievementRepository.findByStudentStudentId(studentId);
    }

    @Transactional
    public Achievement createAchievement(AchievementRequest request) {
        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentId()));

        Sport sport = null;
        if (request.getSportId() != null) {
            sport = sportRepository.findById(request.getSportId()).orElse(null);
        }

        String sportName = request.getSportName();
        if (sportName == null && sport != null) {
            sportName = sport.getName();
        }

        Achievement achievement = new Achievement(
                student,
                sport,
                sportName,
                request.getTitle(),
                request.getDescription(),
                request.getCompetition(),
                request.getAchievementDate(),
                request.getPosition()
        );

        return achievementRepository.save(achievement);
    }

    @Transactional
    public void deleteAchievement(Long id) {
        if (!achievementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Achievement not found with ID: " + id);
        }
        achievementRepository.deleteById(id);
    }
}
