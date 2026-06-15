package com.nibl.ticketing.controller;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService
            dashboardService;

    @GetMapping("/dashboard")
    public DashboardResponse
    getDashboard() {

        return dashboardService
                .getDashboardData();
    }
}