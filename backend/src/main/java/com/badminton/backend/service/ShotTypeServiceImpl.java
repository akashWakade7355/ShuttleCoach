package com.badminton.backend.service;

import com.badminton.backend.entity.ShotType;
import com.badminton.backend.repository.ShotTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShotTypeServiceImpl implements ShotTypeService {
    private final ShotTypeRepository shotTypeRepository;

    public ShotTypeServiceImpl(ShotTypeRepository shotTypeRepository) {
        this.shotTypeRepository = shotTypeRepository;
    }

    @Override
    public List<ShotType> getAllShotTypes() {
        return shotTypeRepository.findAll();
    }
}
