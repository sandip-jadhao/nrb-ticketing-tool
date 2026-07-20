package com.nibl.ticketing.service;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.enums.TicketStatus;
import java.util.*;

public interface TicketService {

    Ticket createTicket(Ticket ticket);

    Ticket assignTicket(Long ticketId, Long engineerId);

    Ticket updateStatus(Long ticketId, TicketStatus status);

    List<Ticket> getAllTickets();

    List<Ticket> getTicketsByUser(Long userId);

    void deleteTicket(Long id);

    List<Ticket> getMyTickets();

    List<Ticket> getAssignedTickets();
}
