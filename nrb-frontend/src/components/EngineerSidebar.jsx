import { FaHome, FaTicketAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

import { Link } from "react-router-dom";

function EngineerSidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-[#002855] text-white">
      <div className="p-6 border-b border-blue-900">
        <h1 className="text-2xl font-bold">NRB Support</h1>

        <p className="text-gray-300 text-sm">Engineer Portal</p>
      </div>

      <div className="p-4 space-y-2">
        <Link
          to="/engineer/dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#003B7A]"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/engineer/tickets"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#003B7A]"
        >
          <FaTicketAlt />
          Assigned Tickets
        </Link>

        <Link
          to="/engineer/profile"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#003B7A]"
        >
          <FaUser />
          Profile
        </Link>

        <button
          onClick={logout}
          className="w-full mt-8 p-3 bg-red-600 rounded hover:bg-red-700"
        >
          <div className="flex items-center justify-center gap-2">
            <FaSignOutAlt />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}

export default EngineerSidebar;
