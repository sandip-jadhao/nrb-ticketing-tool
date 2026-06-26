package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

        User loggedInUser = getLoggedInUser();

        ticket.setCreatedBy(loggedInUser);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setAssignedEngineer(null);

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
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
    @Override
    public List<Ticket> getMyTickets() {

        User user = getLoggedInUser();

        return ticketRepository.findByCreatedById(user.getId());
    }
}
