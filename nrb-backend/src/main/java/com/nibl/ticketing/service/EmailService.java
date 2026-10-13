package com.nibl.ticketing.service;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.entity.User;

public interface EmailService {
    void sendTicketAssignedToEngineer(Ticket ticket, User engineer);
    void sendTicketStatusUpdateToUser(Ticket ticket, User user, String status);
}