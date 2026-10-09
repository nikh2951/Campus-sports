package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByStudentStudentId(String studentId);
    List<Achievement> findByStudentId(Long studentId);
    List<Achievement> findAllByOrderByAchievementDateDesc();
}
