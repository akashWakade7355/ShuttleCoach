package com.badminton.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class PresetShotSelectionId implements Serializable {
    @Column(name = "preset_id", nullable = false)
    private UUID presetId;
    @Column(name = "shot_type_id", nullable = false)
    private Short shotTypeId;

    public PresetShotSelectionId() {}

    public PresetShotSelectionId(UUID presetId, Short shotTypeId) {
        this.presetId = presetId;
        this.shotTypeId = shotTypeId;
    }

    public UUID getPresetId() { return presetId; }
    public void setPresetId(UUID presetId) { this.presetId = presetId; }

    public Short getShotTypeId() { return shotTypeId; }
    public void setShotTypeId(Short shotTypeId) { this.shotTypeId = shotTypeId; }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof PresetShotSelectionId that)) return false; return Objects.equals(presetId, that.presetId) && Objects.equals(shotTypeId, that.shotTypeId); }
    @Override public int hashCode() { return Objects.hash(presetId, shotTypeId); }
}
