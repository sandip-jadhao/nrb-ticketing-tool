import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";

function UserLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <UserSidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default UserLayout;