package com.badminton.backend.repository;

import com.badminton.backend.entity.PresetPositionSelection;
import com.badminton.backend.entity.PresetPositionSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresetPositionSelectionRepository extends JpaRepository<PresetPositionSelection, PresetPositionSelectionId> {
}
