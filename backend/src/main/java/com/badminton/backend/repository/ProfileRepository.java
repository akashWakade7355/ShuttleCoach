package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
}
