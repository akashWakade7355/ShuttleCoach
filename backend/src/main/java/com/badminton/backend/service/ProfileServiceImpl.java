package com.badminton.backend.service;

import com.badminton.backend.entity.Profile;
import com.badminton.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileServiceImpl(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public Optional<Profile> getProfileById(UUID id) {
        return profileRepository.findById(id);
    }
}
