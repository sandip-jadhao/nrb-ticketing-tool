import { useEffect, useState } from "react";
import EngineerLayout from "../../layouts/EngineerLayout";
import DashboardCard from "../../components/DashboardCard";
import { getEngineerTickets } from "../../services/engineerService";

function EngineerDashboard() {

  const [stats, setStats] = useState({
    totalTickets: 0,
    assignedTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {

    try {

      const response = await getEngineerTickets();
      console.log(response.data);
      const tickets = response.data;
      

      setStats({

        totalTickets: tickets.length,

        assignedTickets: tickets.filter(
          t => t.status === "ASSIGNED"
        ).length,

        inProgressTickets: tickets.filter(
          t => t.status === "IN_PROGRESS"
        ).length,

        resolvedTickets: tickets.filter(
          t => t.status === "RESOLVED"
        ).length,

      });

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <EngineerLayout>

      <div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Engineer Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <DashboardCard
            title="Assigned Tickets"
            count={stats.totalTickets}
          />

          <DashboardCard
            title="Assigned"
            count={stats.assignedTickets}
          />
          <DashboardCard
            title="In Progress"
            count={stats.inProgressTickets}
          />
          <DashboardCard
            title="Resolved"
            count={stats.resolvedTickets}
          />
        </div>
      </div>
    </EngineerLayout>
  );
}

export default EngineerDashboard;