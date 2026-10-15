package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.enums.Role;
import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.repository.TicketRepository;
import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.service.EmailService;
import com.nibl.ticketing.service.FileStorageService;
import com.nibl.ticketing.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;
    private static int currentEngineer = 0;
    private final FileStorageService fileStorageService;

    @Override
    public Ticket createTicket(Ticket ticket) {
        return createTicket(ticket, null);
    }

    @Override
    public Ticket createTicket(Ticket ticket, MultipartFile file) {
        User loggedUser = getLoggedInUser();
        ticket.setCreatedBy(loggedUser);

        if (file != null && !file.isEmpty()) {
            String savedFileName = fileStorageService.storeFile(file);
            ticket.setAttachmentPath(savedFileName);
        }

        List<User> engineers = userRepository.findByRole(Role.IT_ENGINEER);
        if (!engineers.isEmpty()) {
            User engineer = engineers.get(currentEngineer);
            ticket.setAssignedEngineer(engineer);
            ticket.setStatus(TicketStatus.ASSIGNED);
            currentEngineer = (currentEngineer + 1) % engineers.size();
        } else {
            ticket.setStatus(TicketStatus.OPEN);
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        if (savedTicket.getAssignedEngineer() != null) {
            emailService.sendTicketAssignedToEngineer(savedTicket, savedTicket.getAssignedEngineer());
        }

        messagingTemplate.convertAndSend("/topic/tickets", savedTicket);
        return savedTicket;
    }

    @Override
    public Ticket assignTicket(Long ticketId, Long engineerId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket Not Found"));
        User engineer = userRepository.findById(engineerId)
                .orElseThrow(() -> new RuntimeException("Engineer Not Found"));

        ticket.setAssignedEngineer(engineer);
        ticket.setStatus(TicketStatus.ASSIGNED);

        Ticket savedTicket = ticketRepository.save(ticket);

        if (savedTicket.getAssignedEngineer() != null) {
            emailService.sendTicketAssignedToEngineer(savedTicket, savedTicket.getAssignedEngineer());
        }

        messagingTemplate.convertAndSend("/topic/tickets", savedTicket);
        return savedTicket;
    }

    @Override
    public Ticket updateStatus(Long ticketId, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket Not Found"));

        ticket.setStatus(status);

        if (status == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else {
            ticket.setResolvedAt(null);
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // Send Email to the user when ticket is RESOLVED or REJECTED
        if (status == TicketStatus.RESOLVED || status == TicketStatus.REJECTED) {
            if (savedTicket.getCreatedBy() != null) {
                emailService.sendTicketStatusUpdateToUser(
                        savedTicket,
                        savedTicket.getCreatedBy(),
                        status.name()
                );
            }
        }

        messagingTemplate.convertAndSend("/topic/tickets", savedTicket);
        return savedTicket;
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

        // Broadcast deletion to update frontend tables instantly
        Map<String, Object> deleteEvent = new HashMap<>();
        deleteEvent.put("deletedTicketId", id);
        messagingTemplate.convertAndSend("/topic/tickets", deleteEvent);
    }

    private User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<Ticket> getMyTickets() {
        User user = getLoggedInUser();
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.IT_ENGINEER) {
            return ticketRepository.findAll();
        }
        return ticketRepository.findByCreatedById(user.getId());
    }

    @Override
    public List<Ticket> getAssignedTickets() {
        User engineer = getLoggedInUser();
        return ticketRepository.findByAssignedEngineerId(engineer.getId());
    }
}