package com.nibl.ticketing.repository;


import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository
        extends JpaRepository<Ticket, Long> {

        List<Ticket> findByCreatedById(Long userId);
         long countByStatus( TicketStatus status);
        long countByCreatedById(Long userId);
        long countByCreatedByIdAndStatus(Long userId, TicketStatus status);
        long countByCreatedByIdAndStatusIn(Long userId, List<TicketStatus> statuses);

    }
