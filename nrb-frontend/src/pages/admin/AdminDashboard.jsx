import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getUsers, getEngineers, getTickets } from "../../services/adminService";
import { wsService } from "../../services/websocketService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    engineers: 0,
    openTickets: 0,
    resolvedTickets: 0,
  });

  const loadStats = async () => {
    try {
      const [usersRes, engineersRes, ticketsRes] = await Promise.allSettled([
        getUsers(),
        getEngineers(),
        getTickets(),
      ]);

      const extractArray = (res) => {
        if (res.status === "fulfilled" && res.value) {
          const d = res.value.data;
          if (Array.isArray(d)) return d;
          if (d && Array.isArray(d.data)) return d.data;
        }
        return [];
      };

      const usersList = extractArray(usersRes);
      let engineersList = extractArray(engineersRes);
      const ticketsList = extractArray(ticketsRes);

      // Filter standard users only (exclude ADMIN, IT_ENGINEER, ENGINEER)
      const standardUsers = usersList.filter((u) => {
        const role = String(u.role || "").toUpperCase();
        return role !== "ADMIN" && role !== "IT_ENGINEER" && role !== "ENGINEER";
      });

      // Fallback for engineers if dedicated endpoint returned empty
      if (engineersList.length === 0 && usersList.length > 0) {
        engineersList = usersList.filter((u) => {
          const role = String(u.role || "").toUpperCase();
          return role === "IT_ENGINEER" || role === "ENGINEER";
        });
      }

      const openCount = ticketsList.filter(
        (t) => t.status !== "RESOLVED" && t.status !== "REJECTED"
      ).length;

      const resolvedCount = ticketsList.filter(
        (t) => t.status === "RESOLVED"
      ).length;

      setStats({
        users: standardUsers.length,
        engineers: engineersList.length,
        openTickets: openCount,
        resolvedTickets: resolvedCount,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  useEffect(() => {
    loadStats();

    wsService.connect(() => {
      wsService.subscribe("/topic/tickets", () => {
        loadStats();
      });
    });

    return () => {
      wsService.unsubscribe("/topic/tickets");
    };
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Engineers",
      value: stats.engineers,
      onClick: () => navigate("/admin/engineers"),
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      onClick: () => navigate("/admin/tickets?filter=OPEN"),
    },
    {
      title: "Resolved Tickets",
      value: stats.resolvedTickets,
      onClick: () => navigate("/admin/tickets?filter=RESOLVED"),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#9B1317]/30 hover:-translate-y-0.5 transition-all select-none group"
            >
              <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                {card.title}
              </p>
              <p className="text-3xl font-extrabold text-[#B91C1C] mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;