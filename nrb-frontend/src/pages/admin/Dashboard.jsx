import DashboardCard from "../components/DashboardCard";

function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">

      <DashboardCard
        title="Total Tickets"
        count={120}
      />

      <DashboardCard
        title="Open Tickets"
        count={45}
      />

      <DashboardCard
        title="Resolved"
        count={60}
      />

      <DashboardCard
        title="Engineers"
        count={10}
      />

    </div>
  );
}

export default Dashboard;