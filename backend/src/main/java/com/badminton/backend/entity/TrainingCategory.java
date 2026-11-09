package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "training_categories", schema = "public")
public class TrainingCategory {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;
    @Column(name = "description", nullable = true, columnDefinition = "text")
    private String description;
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
    @Column(name = "is_active", nullable = false)
    private Boolean active;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    public TrainingCategory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
