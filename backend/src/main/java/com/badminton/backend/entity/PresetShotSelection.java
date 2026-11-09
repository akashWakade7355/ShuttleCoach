package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "preset_shot_selections", schema = "public")
public class PresetShotSelection {
    @EmbeddedId
    private PresetShotSelectionId id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "preset_id", insertable = false, updatable = false)
    private SavedPreset savedPreset;
    @ManyToOne(optional = false)
    @JoinColumn(name = "shot_type_id", insertable = false, updatable = false)
    private ShotType shotType;

    public PresetShotSelection() {}

    public PresetShotSelectionId getId() { return id; }
    public void setId(PresetShotSelectionId id) { this.id = id; }

    public SavedPreset getSavedPreset() { return savedPreset; }
    public void setSavedPreset(SavedPreset savedPreset) { this.savedPreset = savedPreset; }

    public ShotType getShotType() { return shotType; }
    public void setShotType(ShotType shotType) { this.shotType = shotType; }
}
