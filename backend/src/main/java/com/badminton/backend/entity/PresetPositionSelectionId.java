package com.badminton.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class PresetPositionSelectionId implements Serializable {
    @Column(name = "preset_id", nullable = false)
    private UUID presetId;
    @Column(name = "court_side", nullable = false, length = 10)
    private String courtSide;
    @Column(name = "position_id", nullable = false)
    private Short positionId;

    public PresetPositionSelectionId() {}

    public PresetPositionSelectionId(UUID presetId, String courtSide, Short positionId) {
        this.presetId = presetId;
        this.courtSide = courtSide;
        this.positionId = positionId;
    }

    public UUID getPresetId() { return presetId; }
    public void setPresetId(UUID presetId) { this.presetId = presetId; }

    public String getCourtSide() { return courtSide; }
    public void setCourtSide(String courtSide) { this.courtSide = courtSide; }

    public Short getPositionId() { return positionId; }
    public void setPositionId(Short positionId) { this.positionId = positionId; }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof PresetPositionSelectionId that)) return false; return Objects.equals(presetId, that.presetId) && Objects.equals(courtSide, that.courtSide) && Objects.equals(positionId, that.positionId); }
    @Override public int hashCode() { return Objects.hash(presetId, courtSide, positionId); }
}
