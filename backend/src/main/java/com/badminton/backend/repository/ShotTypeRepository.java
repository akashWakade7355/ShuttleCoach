package com.badminton.backend.repository;

import com.badminton.backend.entity.ShotType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ShotTypeRepository extends JpaRepository<ShotType, Short> {
    List<ShotType> findByActiveTrue();

    List<ShotType> findByIdInAndActiveTrue(Collection<Short> ids);
}
