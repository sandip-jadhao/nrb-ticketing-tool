import { FaHome,FaUsers,FaUserCog,FaTicketAlt,FaUser,FaSignOutAlt,} from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
<<<<<<< HEAD
    <div className="w-64 bg-[#C51B17] text-white">
      <div className="p-6 border-b border-[#991B1B]">
        <h1 className="text-2xl font-bold">NRB Support</h1>
=======
    <div className="w-64 bg-red-700 text-white">
      <div className="p-2 border-b border-red-900 bg-">
        <h1 className="text-2xl font-bold ">NRB Support</h1>
>>>>>>> b333a12 (feat: add profiles and initialize data)

        <p className="text-gray-300 text-sm">Admin Portal</p>
      </div>

      <div className="p-4 space-y-2">
<<<<<<< HEAD
        <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
=======
        <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-red-900">
>>>>>>> b333a12 (feat: add profiles and initialize data)
          <FaHome />
             Dashboard
        </Link>

<<<<<<< HEAD
        <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
=======
        <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded hover:bg-red-900">
>>>>>>> b333a12 (feat: add profiles and initialize data)
          <FaUsers />
          Users
        </Link>

<<<<<<< HEAD
        <Link to="/admin/engineers" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
=======
        <Link to="/admin/engineers" className="flex items-center gap-3 p-3 rounded hover:bg-red-900">
>>>>>>> b333a12 (feat: add profiles and initialize data)
          <FaUserCog />
          Engineers
        </Link>

<<<<<<< HEAD
        <Link to="/admin/tickets" className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
=======
        <Link to="/admin/tickets" className="flex items-center gap-3 p-3 rounded hover:bg-red-900">
>>>>>>> b333a12 (feat: add profiles and initialize data)
          <FaTicketAlt />
          Tickets
        </Link>

<<<<<<< HEAD
        <Link to="/admin/profile"className="flex items-center gap-3 p-3 rounded hover:bg-[#991B1B]">
=======
        <Link to="/admin/AdminProfile"className="flex items-center gap-3 p-3 rounded hover:bg-red-900">
>>>>>>> b333a12 (feat: add profiles and initialize data)
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

export default Sidebar;
