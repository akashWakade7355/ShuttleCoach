package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "training_videos", schema = "public")
public class TrainingVideo {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;
    @Column(name = "category_id", nullable = false)
    private Long categoryId;
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    @Column(name = "description", nullable = true, columnDefinition = "text")
    private String description;
    @Column(name = "video_url", nullable = false, columnDefinition = "text")
    private String videoUrl;
    @Column(name = "thumbnail_url", nullable = true, columnDefinition = "text")
    private String thumbnailUrl;
    @Column(name = "duration_seconds", nullable = true)
    private Integer durationSeconds;
    @Column(name = "difficulty_level", nullable = true, length = 20)
    private String difficultyLevel;
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
    @Column(name = "is_published", nullable = false)
    private Boolean published;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private TrainingCategory category;

    public TrainingVideo() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public TrainingCategory getCategory() { return category; }
    public void setCategory(TrainingCategory category) { this.category = category; }
}
