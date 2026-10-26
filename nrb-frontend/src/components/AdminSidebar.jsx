import {
  FaHome,
  FaUsers,
  FaUserCog,
  FaTicketAlt,
  FaFileExcel,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navLinks = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
      icon: <FaHome className="text-sm" />,
    },
    {
      path: "/admin/tickets",
      name: "TICKETS",
      icon: <FaTicketAlt className="text-sm" />,
    },
    {
      path: "/admin/users",
      name: "USERS",
      icon: <FaUsers className="text-sm" />,
    },
    {
      path: "/admin/engineers",
      name: "ENGINEERS",
      icon: <FaUserCog className="text-sm" />,
    },
    {
      path: "/admin/reports",
      name: "REPORTS",
      icon: <FaFileExcel className="text-sm" />,
    },
    {
      path: "/admin/adminprofile",
      name: "PROFILE",
      icon: <FaUser className="text-sm" />,
    },
  ];

  return (
    <div className="flex h-screen w-full flex-col justify-between bg-[#9B1317] text-white select-none">
      <div className="p-4">
        <div className="relative overflow-hidden rounded-lg bg-white px-3.5 py-4 shadow-lg shadow-black/25 ring-1 ring-white/40 transition-transform duration-300 hover:scale-[1.03] mb-6 flex items-center justify-center">
          <img
            src="/nrb-logo.jpg"
            alt="NRB Industrial Bearings"
            className="h-8 w-auto object-contain select-none"
            onError={(e) => {
              // Fallback to root path if subfolder isn't used
              e.target.src = "/nrb-logo.jpg";
            }}
          />
          <div
            className="absolute inset-0 w-1/2 h-full pointer-events-none bg-gradient-to-r from-transparent via-white/70 to-transparent animate-wave-light"
            aria-hidden="true"
          />
        </div>

        {/* Section Header */}
        <div className="px-3 pb-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-200/60">
            ADMINISTRATION
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navLinks.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition ${
                  isActive
                    ? "bg-[#800f13] border border-white/20 text-white shadow-inner"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-4 flex items-center justify-center">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area with Clean Logout */}
      <div className="p-4 border-t border-red-900/40">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-[#800f13] hover:bg-black/20 border border-white/10 text-white text-xs font-bold py-2.5 rounded-lg transition cursor-pointer"
        >
          <FaSignOutAlt />
          <span>LOG OUT</span>
        </button>

        <div className="text-center mt-3 text-[10px] font-bold tracking-wider text-red-200/40 uppercase">
          IT SUPPORT PORTAL
        </div>
      </div>
    </div>
  );
}

export default Sidebar;