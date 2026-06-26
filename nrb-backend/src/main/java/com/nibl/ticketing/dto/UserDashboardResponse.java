package com.nibl.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardResponse {

    private long myTickets;
    private long openTickets;
    private long assignedTickets;
    private long resolvedTickets;
}