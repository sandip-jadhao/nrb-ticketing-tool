import {
  FaHome,
  FaPlusCircle,
  FaTicketAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function UserSidebar() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (

    <div className="w-64 bg-[#C51B17] text-white">

      <div className="p-6 border-b border-[#991B1B]">

        <h1 className="text-2xl font-bold">
          NRB Support
        </h1>

        <p className="text-gray-300 text-sm">
          User Portal
        </p>

      </div>

      <div className="p-4 space-y-2">

        <Link
          to="/user/dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/user/create-ticket"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]"
        >
          <FaPlusCircle />
          Create Ticket
        </Link>

        <Link
          to="/user/tickets"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]"
        >
          <FaTicketAlt />
          My Tickets
        </Link>

        <Link
          to="/user/profile"
          className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]"
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

export default UserSidebar;
