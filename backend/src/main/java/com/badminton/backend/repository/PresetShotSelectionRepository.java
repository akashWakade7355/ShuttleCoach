package com.badminton.backend.repository;

import com.badminton.backend.entity.PresetShotSelection;
import com.badminton.backend.entity.PresetShotSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresetShotSelectionRepository extends JpaRepository<PresetShotSelection, PresetShotSelectionId> {
}
