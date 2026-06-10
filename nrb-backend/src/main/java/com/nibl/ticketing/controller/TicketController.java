package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.service.TicketService;
import lombok.RequiredArgsConstructor;
import java.util.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public Ticket createTicket(
            @RequestBody Ticket ticket) {

        return ticketService.createTicket(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {

        return ticketService.getAllTickets();
    }

    @PutMapping("/{id}/assign/{engineerId}")
    public Ticket assignTicket(
            @PathVariable Long id,
            @PathVariable Long engineerId) {

        return ticketService.assignTicket(
                id,
                engineerId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('IT_ENGINEER')")
    public Ticket updateStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {

        return ticketService.updateStatus(
                id,
                status);
    }
}
