import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import DashboardCard from "../../components/DashboardCard";
import { getTickets } from "../../services/ticketService";
import { wsService } from "../../services/websocketService";

function UserDashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    assignedTickets: 0,
    resolvedTickets: 0,
  });

  const loadTickets = async () => {
    try {
      const response = await getTickets();
      const myTickets = response.data || [];

      const open = myTickets.filter(
        (ticket) => ticket.status === "OPEN"
      ).length;

      const assigned = myTickets.filter(
        (ticket) =>
          ticket.status === "ASSIGNED" || ticket.status === "IN_PROGRESS"
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
      console.error("Error loading tickets:", error);
    }
  };

  useEffect(() => {
    loadTickets();

    wsService.connect(() => {
      wsService.subscribe("/topic/tickets", () => {
        loadTickets();
      });
    });

    return () => {
      wsService.unsubscribe("/topic/tickets");
    };
  }, []);

  // Formatted date string
  const todayDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate resolution percentage
  const completionRate =
    stats.totalTickets > 0
      ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100)
      : 0;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* ===================== NPD HEADER AREA ===================== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              DASHBOARD - USER WORKSPACE
            </h1>
            <p className="text-xs text-gray-500 mt-1">{todayDate}</p>
          </div>

          <Link
            to="/user/create-ticket"
            className="bg-[#9B1317] hover:bg-[#800f13] text-white text-xs font-bold tracking-wider px-5 py-2.5 rounded-lg shadow-sm uppercase transition"
          >
            CREATE NEW TICKET
          </Link>
        </div>

        {/* ===================== NPD METRIC CARDS ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Total Raised */}
          <DashboardCard
            title="MY TICKETS"
            count={stats.totalTickets}
            subtext="tickets raised by you"
            badge="Total"
            badgeType="neutral"
            linkText="View all tickets →"
            linkTo="/user/tickets"
          />

          {/* 2. Open / Pending */}
          <DashboardCard
            title="OPEN"
            count={stats.openTickets}
            subtext="awaiting response"
            badge={stats.openTickets > 0 ? `${stats.openTickets} pending` : "None"}
            badgeType={stats.openTickets > 0 ? "danger" : "neutral"}
            linkText="Review open →"
            linkTo="/user/tickets"
            highlight={stats.openTickets > 0}
          />

          {/* 3. Assigned / In Progress */}
          <DashboardCard
            title="IN ACTION"
            count={stats.assignedTickets}
            subtext="currently working on"
            badge={stats.assignedTickets > 0 ? "Active" : "Idle"}
            badgeType="info"
            linkText="Track status →"
            linkTo="/user/tickets"
          />

          {/* 4. Resolved */}
          <DashboardCard
            title="RESOLVED"
            count={stats.resolvedTickets}
            subtext="closed successfully"
            badge={`${completionRate}% done`}
            badgeType="success"
            linkText="View history →"
            linkTo="/user/tickets"
          />
        </div>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;