package com.badminton.backend.repository;

import com.badminton.backend.entity.TrainingCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingCategoryRepository extends JpaRepository<TrainingCategory, Long> {
}
