import Sidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-64 shrink-0 self-stretch">
        <Sidebar />
      </aside>

      <div className=" flex flex-1 min-w-0 flex-col bg-slate-100">
        <Navbar />
        <main className=" flex-1 min-w-0 p-6">
         {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;