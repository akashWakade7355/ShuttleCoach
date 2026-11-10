package com.badminton.backend.service;

import com.badminton.backend.entity.Profile;
import java.util.Optional;
import java.util.UUID;

public interface ProfileService {
    Optional<Profile> getProfileById(UUID id);
}
