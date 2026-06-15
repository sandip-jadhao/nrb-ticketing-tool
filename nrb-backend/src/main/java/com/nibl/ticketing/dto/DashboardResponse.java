package com.nibl.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private long totalUsers;
    private long totalEngineers;
    private long openTickets;
    private long resolvedTickets;
}