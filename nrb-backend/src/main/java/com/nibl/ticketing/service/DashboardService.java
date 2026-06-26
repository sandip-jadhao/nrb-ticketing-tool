package com.nibl.ticketing.service;

import com.nibl.ticketing.dto.DashboardResponse;
import com.nibl.ticketing.dto.UserDashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboardData();
    UserDashboardResponse getUserDashboard();
}