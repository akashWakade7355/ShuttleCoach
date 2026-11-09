package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.SavedPreset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedPresetRepository extends JpaRepository<SavedPreset, UUID> {
}
