package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.SportsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SportsEventRepository extends JpaRepository<SportsEvent, Long> {
    List<SportsEvent> findByStatusOrderByEventDateAsc(String status);
    List<SportsEvent> findAllByOrderByEventDateDesc();
    long countByStatus(String status);
}
