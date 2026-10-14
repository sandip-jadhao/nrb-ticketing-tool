import { FaHome, FaTicketAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function EngineerSidebar() {
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navLinks = [
    {
      path: "/engineer/dashboard",
      name: "DASHBOARD",
      icon: <FaHome className="text-sm" />,
    },
    {
      path: "/engineer/tickets",
      name: "ASSIGNED TICKETS",
      icon: <FaTicketAlt className="text-sm" />,
    },
    {
      path: "/engineer/EngineerProfile",
      name: "PROFILE",
      icon: <FaUser className="text-sm" />,
    },
  ];

  return (
    // Locked to w-64 min-w-[16rem] shrink-0 to prevent full-width stretching
    <div className="w-64 min-w-[16rem] max-w-[16rem] h-screen shrink-0 flex flex-col justify-between bg-[#9B1317] text-white select-none shadow-xl">
      <div className="p-4">
        {/* ================= NPD LOGO PANEL WITH WAVE LIGHT ================= */}
        <div className="relative overflow-hidden rounded-lg bg-white px-3 py-2 shadow-lg shadow-black/25 ring-1 ring-white/20 transition-transform duration-300 hover:scale-[1.02] mb-6 flex items-center justify-center">
          {/* Logo Image */}
          <img
            src="/nrb-logo.jpg"
            alt="NRB Industrial Bearings"
            className="h-12 w-15 object-contain select-none"
            onError={(e) => {
              e.target.src = "/nrb-logo.jpg";
            }}
          />

          {/* Periodic Wave Light Sheen */}
          <div
            className="absolute inset-0 w-1/2 h-full pointer-events-none bg-gradient-to-r from-transparent via-white/70 to-transparent animate-wave-light"
            aria-hidden="true"
          />
        </div>

        {/* Section Header */}
        <div className="px-3 pb-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-200/60">
            ENGINEER PORTAL
          </span>
        </div>

        {/* Navigation Links with Active State Detection */}
        <nav className="space-y-1.5">
          {navLinks.map((item) => {
            const isActive =
              location.pathname.toLowerCase() === item.path.toLowerCase();

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
          className="w-full flex items-center justify-center gap-2 bg-[#800f13] hover:bg-black/20 border border-white/10 text-white text-xs font-bold py-2.5 rounded-lg transition"
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

export default EngineerSidebar;