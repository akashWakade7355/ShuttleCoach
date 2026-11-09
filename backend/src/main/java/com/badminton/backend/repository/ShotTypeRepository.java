package com.badminton.backend.repository;

import com.badminton.backend.entity.ShotType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShotTypeRepository extends JpaRepository<ShotType, Short> {
}
