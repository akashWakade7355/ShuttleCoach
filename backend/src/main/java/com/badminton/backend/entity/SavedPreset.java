package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_presets", schema = "public")
public class SavedPreset {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @Column(name = "preset_name", nullable = false, length = 100)
    private String presetName;
    @Column(name = "planned_repetitions", nullable = false)
    private Integer plannedRepetitions;
    @Column(name = "recovery_time_seconds", nullable = false)
    private Integer recoveryTimeSeconds;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private Profile profile;

    public SavedPreset() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getPresetName() { return presetName; }
    public void setPresetName(String presetName) { this.presetName = presetName; }

    public Integer getPlannedRepetitions() { return plannedRepetitions; }
    public void setPlannedRepetitions(Integer plannedRepetitions) { this.plannedRepetitions = plannedRepetitions; }

    public Integer getRecoveryTimeSeconds() { return recoveryTimeSeconds; }
    public void setRecoveryTimeSeconds(Integer recoveryTimeSeconds) { this.recoveryTimeSeconds = recoveryTimeSeconds; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }
}
