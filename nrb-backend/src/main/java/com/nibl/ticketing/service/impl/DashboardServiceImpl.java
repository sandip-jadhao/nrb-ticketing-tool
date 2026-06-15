package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.dto.DashboardResponse;
import com.nibl.ticketing.enums.Role;
import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.repository.TicketRepository;
import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final UserRepository
            userRepository;

    private final TicketRepository
            ticketRepository;

    @Override
    public DashboardResponse
    getDashboardData() {

        long users =
                userRepository.countByRole(
                        Role.USER);

        long engineers =
                userRepository.countByRole(
                        Role.IT_ENGINEER);

        long openTickets =
                ticketRepository.countByStatus(
                        TicketStatus.OPEN);

        long resolvedTickets =
                ticketRepository.countByStatus(
                        TicketStatus.RESOLVED);

        return new DashboardResponse(
                users,
                engineers,
                openTickets,
                resolvedTickets
        );
    }
}