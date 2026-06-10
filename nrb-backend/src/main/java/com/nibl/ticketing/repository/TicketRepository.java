package com.nibl.ticketing.repository;


import com.nibl.ticketing.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository
        extends JpaRepository<Ticket, Long> {

        List<Ticket> findByCreatedById(Long userId);

    }
