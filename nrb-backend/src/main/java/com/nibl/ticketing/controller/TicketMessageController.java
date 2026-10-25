package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.entity.TicketMessage;
import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.enums.Role;
import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.repository.TicketMessageRepository;
import com.nibl.ticketing.repository.TicketRepository;
import com.nibl.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketMessageController {

    private final TicketMessageRepository messageRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{ticketId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable(name = "ticketId") Long ticketId) {
        try {
            Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
            if (ticket == null || ticket.getStatus() == TicketStatus.RESOLVED) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            User currentUser = getAuthenticatedUser();
            if (!hasAccess(currentUser, ticket)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied for user " + currentUser.getEmail()));
            }

            List<TicketMessage> messages = messageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
            List<Map<String, Object>> responseList = messages.stream()
                    .map(this::toMessageDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseList);
        } catch (Throwable ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "exception", ex.getClass().getName(),
                            "message", String.valueOf(ex.getMessage())
                    ));
        }
    }

    @PostMapping("/{ticketId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable(name = "ticketId") Long ticketId,
            @RequestBody Map<String, String> payload
    ) {
        try {
            Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
            if (ticket == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Ticket not found"));
            }

            if (ticket.getStatus() == TicketStatus.RESOLVED) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Coordination chat is closed for resolved tickets."));
            }

            User sender = getAuthenticatedUser();
            if (!hasAccess(sender, ticket)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            String content = payload.get("message");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Message cannot be empty."));
            }

            TicketMessage message = new TicketMessage();
            message.setTicket(ticket);
            message.setSender(sender);
            message.setMessage(content.trim());

            TicketMessage savedMessage = messageRepository.save(message);
            Map<String, Object> messagePayload = toMessageDto(savedMessage);

            messagingTemplate.convertAndSend("/topic/ticket-messages/" + ticketId, messagePayload);

            return ResponseEntity.ok(messagePayload);
        } catch (Throwable ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "exception", ex.getClass().getName(),
                            "message", String.valueOf(ex.getMessage())
                    ));
        }
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<Map<String, String>> handleOutsideException(Throwable ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "exception", ex.getClass().getName(),
                        "message", String.valueOf(ex.getMessage())
                ));
    }

    private Map<String, Object> toMessageDto(TicketMessage msg) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", msg.getId());
        map.put("message", msg.getMessage());
        map.put("createdAt", msg.getCreatedAt() != null ? msg.getCreatedAt().toString() : null);

        User s = msg.getSender();
        if (s != null) {
            Map<String, Object> senderMap = new HashMap<>();
            senderMap.put("id", s.getId());
            senderMap.put("email", s.getEmail());
            senderMap.put("firstName", s.getFirstName());
            senderMap.put("lastName", s.getLastName());
            senderMap.put("role", s.getRole() != null ? s.getRole().name() : "USER");
            map.put("sender", senderMap);
        }
        return map;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + email));
    }

    private boolean hasAccess(User user, Ticket ticket) {
        if (user == null || ticket == null) {
            return false;
        }
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.IT_ENGINEER) {
            return true;
        }
        if (ticket.getCreatedBy() != null) {
            Long creatorId = ticket.getCreatedBy().getId();
            String creatorEmail = ticket.getCreatedBy().getEmail();
            return Objects.equals(creatorId, user.getId()) ||
                    (creatorEmail != null && creatorEmail.equalsIgnoreCase(user.getEmail()));
        }
        return false;
    }
}