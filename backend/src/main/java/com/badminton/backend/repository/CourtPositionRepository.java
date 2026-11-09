package com.badminton.backend.repository;

import com.badminton.backend.entity.CourtPosition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtPositionRepository extends JpaRepository<CourtPosition, Short> {
}
