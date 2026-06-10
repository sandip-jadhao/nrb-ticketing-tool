package com.nibl.ticketing.repository;

import com.nibl.ticketing.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EngineerRepository
        extends JpaRepository<Engineer, Long> {
}