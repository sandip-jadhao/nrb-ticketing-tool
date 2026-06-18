import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";
import { getDashboardData } from "../../services/adminService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEngineers: 0,
    openTickets: 0,
    resolvedTickets: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
  try {
    const data = await getDashboardData();

    console.log("Dashboard Data:", data);

    setStats(data);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
};  

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Users"
            count={stats.totalUsers}
          />

          <DashboardCard
            title="Engineers"
            count={stats.totalEngineers}
          />

          <DashboardCard
            title="Open Tickets"
            count={stats.openTickets}
          />

          <DashboardCard
            title="Resolved Tickets"
            count={stats.resolvedTickets}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;