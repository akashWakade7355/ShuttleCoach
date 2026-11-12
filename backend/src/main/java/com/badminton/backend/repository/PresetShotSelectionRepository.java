package com.badminton.backend.repository;

import com.badminton.backend.entity.PresetShotSelection;
import com.badminton.backend.entity.PresetShotSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PresetShotSelectionRepository extends JpaRepository<PresetShotSelection, PresetShotSelectionId> {
    List<PresetShotSelection> findById_PresetId(UUID presetId);
}
