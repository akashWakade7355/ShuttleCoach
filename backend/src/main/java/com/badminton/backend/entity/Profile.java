package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "profiles", schema = "public")
public class Profile {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;
    @Column(name = "full_name", nullable = true, length = 100)
    private String fullName;
    @Column(name = "avatar_url", nullable = true, columnDefinition = "text")
    private String avatarUrl;
    @Column(name = "created_at", nullable = true)
    private OffsetDateTime createdAt;
    @Column(name = "updated_at", nullable = true)
    private OffsetDateTime updatedAt;

    public Profile() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
