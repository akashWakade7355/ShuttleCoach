package com.badminton.backend.repository;

import com.badminton.backend.entity.SavedPreset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SavedPresetRepository extends JpaRepository<SavedPreset, UUID> {
    List<SavedPreset> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<SavedPreset> findByIdAndUserId(UUID id, UUID userId);
}
