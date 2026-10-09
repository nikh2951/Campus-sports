package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    Optional<Sport> findByNameIgnoreCase(String name);
    List<Sport> findByCategoryAndActive(String category, boolean active);
    List<Sport> findByActive(boolean active);
    boolean existsByNameIgnoreCase(String name);
}
