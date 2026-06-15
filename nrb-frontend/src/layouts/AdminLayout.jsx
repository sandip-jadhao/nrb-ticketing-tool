import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 bg-slate-100">

        <Navbar />

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;