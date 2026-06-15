import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";

function Dashboard() {

  return (
    <AdminLayout>

      <div className="grid grid-cols-4 gap-6">

        <DashboardCard
          title="Total Users"
          count="10"
        />

        <DashboardCard
          title="Engineers"
          count="4"
        />

        <DashboardCard
          title="Open Tickets"
          count="12"
        />

        <DashboardCard
          title="Resolved"
          count="8"
        />

      </div>

    </AdminLayout>
  );
}

export default Dashboard;