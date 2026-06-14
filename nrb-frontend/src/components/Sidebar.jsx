import {
  FaHome,
  FaTicketAlt,
  FaUsers,
  FaUserCog,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#002855] text-white">

      <div className="p-6 border-b border-blue-900">

        <h1 className="text-2xl font-bold">
          NRB Support
        </h1>

        <p className="text-sm text-gray-300">
          Ticketing System
        </p>

      </div>

      <nav className="p-4 space-y-2">

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#003B7A]">
          <FaHome />
          Dashboard
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#003B7A]">
          <FaTicketAlt />
          Tickets
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#003B7A]">
          <FaUsers />
          Users
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#003B7A]">
          <FaUserCog />
          Engineers
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 mt-10">
          <FaSignOutAlt />
          Logout
        </button>

      </nav>
    </div>
  );
}

export default Sidebar;