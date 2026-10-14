import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";

function UserLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F7F9]">
      {/* Locked Sidebar Container */}
      <aside className="w-64 shrink-0 self-stretch shadow-xl">
        <UserSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        {/* Scrollable Canvas matching Admin/Engineer */}
        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UserLayout;