package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.TrainingVideo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingVideoRepository extends JpaRepository<TrainingVideo, UUID> {
}
