package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "preset_position_selections", schema = "public")
public class PresetPositionSelection {
    @EmbeddedId
    private PresetPositionSelectionId id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "preset_id", insertable = false, updatable = false)
    private SavedPreset savedPreset;
    @ManyToOne(optional = false)
    @JoinColumn(name = "position_id", insertable = false, updatable = false)
    private CourtPosition courtPosition;

    public PresetPositionSelection() {}

    public PresetPositionSelectionId getId() { return id; }
    public void setId(PresetPositionSelectionId id) { this.id = id; }

    public SavedPreset getSavedPreset() { return savedPreset; }
    public void setSavedPreset(SavedPreset savedPreset) { this.savedPreset = savedPreset; }

    public CourtPosition getCourtPosition() { return courtPosition; }
    public void setCourtPosition(CourtPosition courtPosition) { this.courtPosition = courtPosition; }
}
