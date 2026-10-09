package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findBySportIdAndActive(Long sportId, boolean active);
    List<Equipment> findByActive(boolean active);
    
    @Query("SELECT SUM(e.availableQuantity) FROM Equipment e WHERE e.active = true")
    Long sumAvailableQuantity();
    
    @Query("SELECT SUM(e.totalQuantity) FROM Equipment e WHERE e.active = true")
    Long sumTotalQuantity();
}
