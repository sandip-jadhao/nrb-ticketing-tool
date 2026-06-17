import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEngineers: 0,
    openTickets: 0,
    resolvedTickets: 0,
  });
  
 const loadDashboard = async () => {
    try {
      const data = await getDashboardData();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3>Total Users</h3>
        <p className="text-3xl font-bold">{stats.totalUsers}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3>Total Engineers</h3>
        <p className="text-3xl font-bold">{stats.totalEngineers}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3>Open Tickets</h3>
        <p className="text-3xl font-bold">{stats.openTickets}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3>Resolved Tickets</h3>
        <p className="text-3xl font-bold">{stats.resolvedTickets}</p>
      </div>
    </div>
  );
}

export default Dashboard;