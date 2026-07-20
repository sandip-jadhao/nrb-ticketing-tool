package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.dto.DashboardResponse;
import com.nibl.ticketing.dto.UserDashboardResponse;
import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.enums.Role;
import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.repository.TicketRepository;
import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;

    private final TicketRepository ticketRepository;

    @Override
    public DashboardResponse getDashboardData() {

        long users =
                userRepository.countByRole(
                        Role.USER);

        long engineers =
                userRepository.countByRole(
                        Role.IT_ENGINEER);

        long openTickets =
                ticketRepository.countByStatusIn(
                        List.of(
                                TicketStatus.OPEN,
                                TicketStatus.ASSIGNED,
                                TicketStatus.IN_PROGRESS
                        )
                );

        long resolvedTickets =
                ticketRepository.countByStatusIn(
                        List.of(
                                TicketStatus.RESOLVED,
                                TicketStatus.CLOSED
                        )
                );

        return new DashboardResponse(
                users,
                engineers,
                openTickets,
                resolvedTickets
        );

    }

    @Override
    public UserDashboardResponse getUserDashboard() {

        User user = getLoggedInUser();

        long total =
                ticketRepository.countByCreatedById(user.getId());

        long open =
                ticketRepository.countByCreatedByIdAndStatus(
                        user.getId(),
                        TicketStatus.OPEN);

        long assigned =
                ticketRepository.countByCreatedByIdAndStatusIn(
                        user.getId(),
                        List.of(
                                TicketStatus.ASSIGNED,
                                TicketStatus.IN_PROGRESS
                        ));

        long resolved =
                ticketRepository.countByCreatedByIdAndStatus(
                        user.getId(),
                        TicketStatus.RESOLVED);

        return new UserDashboardResponse(
                total,
                open,
                assigned,
                resolved
        );
    }
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}