package com.nibl.ticketing.controller;

import com.nibl.ticketing.dto.UserDashboardResponse;
import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.service.DashboardService;
import com.nibl.ticketing.service.TicketService;
import com.nibl.ticketing.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TicketService ticketService;
    private final DashboardService dashboardService ;

    /**
     * Get User Profile
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                userService.getUser(id));
    }

    /**
     * Update User Profile
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.updateUser(id, user));
    }

    /**
     * Create Ticket
     */
    @PostMapping("/ticket")
    public ResponseEntity<Ticket> createTicket(
            @RequestBody Ticket ticket) {

        return ResponseEntity.ok(
                ticketService.createTicket(ticket));
    }

    /**
     * View My Tickets
     */
    @GetMapping("/{userId}/tickets")
    public ResponseEntity<List<Ticket>> getMyTickets(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                ticketService.getTicketsByUser(userId));
    }

    @GetMapping("/dashboard")
    public UserDashboardResponse getDashboard() {
        return dashboardService.getUserDashboard();
    }

    @GetMapping("/profile")
    public User getProfile() {
        return userService.getLoggedInUser();
    }
}