package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "shot_types", schema = "public")
public class ShotType {
    @Id
    @Column(name = "id", nullable = false)
    private Short id;
    @Column(name = "shot_name", nullable = false, length = 50)
    private String shotName;
    @Column(name = "description", nullable = true, columnDefinition = "text")
    private String description;
    @Column(name = "is_active", nullable = true)
    private Boolean active;

    public ShotType() {}

    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }

    public String getShotName() { return shotName; }
    public void setShotName(String shotName) { this.shotName = shotName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
