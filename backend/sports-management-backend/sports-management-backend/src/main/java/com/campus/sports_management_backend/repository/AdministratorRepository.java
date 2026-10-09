package com.campus.sports_management_backend.repository;

import com.campus.sports_management_backend.entity.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    Optional<Administrator> findByAdminId(String adminId);
    Optional<Administrator> findByEmail(String email);
    Optional<Administrator> findByAdminIdAndEmail(String adminId, String email);
    boolean existsByAdminId(String adminId);
    boolean existsByEmail(String email);
}
