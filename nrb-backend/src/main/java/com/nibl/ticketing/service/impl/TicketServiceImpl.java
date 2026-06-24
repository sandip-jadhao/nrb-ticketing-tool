package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.repository.TicketRepository;
import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.entity.User;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    public Ticket createTicket(Ticket ticket) {

        ticket.setStatus(TicketStatus.OPEN);

        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket assignTicket(
            Long ticketId,
            Long engineerId) {

        Ticket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow();

        User engineer =
                userRepository.findById(engineerId)
                        .orElseThrow();

        ticket.setAssignedEngineer(engineer);
        ticket.setStatus(TicketStatus.ASSIGNED);

        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket updateStatus(
            Long ticketId,
            TicketStatus status) {

        Ticket ticket = ticketRepository
                .findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException("Ticket Not Found"));

        ticket.setStatus(status);

        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public List<Ticket> getTicketsByUser(Long userId) {

        return ticketRepository.findByCreatedById(userId);
    }
    @Override
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
}
