import Sidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <aside className="w-64 shrink-0 self-stretch">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden pl-6 pr-2 py-4 flex flex-col">
         {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;