import { useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import DashboardCard from "../../components/DashboardCard";
import { getTickets } from "../../services/ticketService";

function UserDashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    assignedTickets: 0,
    resolvedTickets: 0,
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getTickets();

      
      const myTickets = response.data;

      const open = myTickets.filter(
        (ticket) => ticket.status === "OPEN"
      ).length;

      const assigned = myTickets.filter(
        (ticket) =>
          ticket.status === "ASSIGNED" ||
          ticket.status === "IN_PROGRESS"
      ).length;

      const resolved = myTickets.filter(
        (ticket) => ticket.status === "RESOLVED"
      ).length;

      setStats({
        totalTickets: myTickets.length,
        openTickets: open,
        assignedTickets: assigned,
        resolvedTickets: resolved,
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          User Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <DashboardCard
            title="My Tickets"
            count={stats.totalTickets}
          />

          <DashboardCard
            title="Open"
            count={stats.openTickets}
          />

          <DashboardCard
            title="Assigned"
            count={stats.assignedTickets}
          />

          <DashboardCard
            title="Resolved"
            count={stats.resolvedTickets}
          />

        </div>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;