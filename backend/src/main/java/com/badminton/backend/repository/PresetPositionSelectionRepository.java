package com.badminton.backend.repository;

import com.badminton.backend.entity.PresetPositionSelection;
import com.badminton.backend.entity.PresetPositionSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PresetPositionSelectionRepository extends JpaRepository<PresetPositionSelection, PresetPositionSelectionId> {
    List<PresetPositionSelection> findById_PresetId(UUID presetId);

    List<PresetPositionSelection> findById_PresetIdAndId_CourtSide(
            UUID presetId,
            String courtSide
    );
}
