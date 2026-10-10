import { FaHome,FaUsers,FaUserCog,FaTicketAlt,FaUser,FaSignOutAlt,} from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className=" flex min-h-screen w-full flex-col bg-red-700 text-white">
      <div className="p-2 border-b border-red-900 bg-">
        <h1 className="text-2xl font-bold ">NRB Support</h1>
        <p className="text-gray-300 text-sm">Admin Portal</p>
      </div>

      <div className="p-4 space-y-2 h-full">
        <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
          <FaHome />
             Dashboard
        </Link>

        <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
          <FaUsers />
          Users
        </Link>

        <Link to="/admin/engineers" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
          <FaUserCog />
          Engineers
        </Link>

        <Link to="/admin/tickets" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
          <FaTicketAlt />
          Tickets
        </Link>

        <Link to="/admin/adminprofile"className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
          <FaUser />
          Profile
        </Link>

        <button
          onClick={logout}
          className="w-full mt-8 p-3 bg-red-600 rounded hover:bg-red-900"
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

export default Sidebar;
