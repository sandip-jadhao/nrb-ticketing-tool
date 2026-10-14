import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role") || "Admin";
  const firstName = localStorage.getItem("firstName") || "System";
  const lastName = localStorage.getItem("lastName") || "Admin";

  // Generate 2-letter uppercase initials (e.g., "SJ" or "SA")
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const profileRoute = (() => {
    const userRole = (role || localStorage.getItem("role") || "").toUpperCase();
    if (userRole === "ADMIN") return "/admin/Adminprofile"; // or "/admin/AdminProfile" depending on your App.jsx route
    if (userRole === "IT_ENGINEER" || userRole === "ENGINEER") return "/engineer/EngineerProfile";
    return "/user/profile";
  })();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8 gap-3 shrink-0 shadow-sm">
      {/* Notifications Icon with Badge */}
      <div className="relative cursor-pointer p-1 text-gray-600 hover:text-gray-900 transition">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute -top-1 -right-1 bg-[#9B1317] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          7
        </span>
      </div>

     <Link
  to={profileRoute}
  title="View Profile"
  className="flex items-center gap-3.5 bg-[#FAF6F6] hover:bg-[#F3EBEB] px-4 py-2 rounded-2xl border border-red-100/60 transition-all duration-200 cursor-pointer group select-none shadow-sm hover:shadow"
>
  {/* Circular Avatar Badge */}
  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#9B1317] font-extrabold text-sm tracking-tight border border-gray-100 group-hover:scale-105 transition-transform shrink-0">
    {initials}
  </div>

  {/* Name and Role text */}
  <div className="flex flex-col text-left leading-tight pr-1">
    <span className="text-sm font-bold text-gray-800 group-hover:text-[#9B1317] transition-colors">
      {firstName} {lastName}
    </span>
    <span className="text-xs text-gray-400 capitalize group-hover:text-[#9B1317]/80 transition-colors">
      {role ? role.toLowerCase().replace("_", " ") : "user"}
    </span>
  </div>
</Link>
      {/* Action Buttons */}
      <button
        type="button"
        className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 transition"
      >
        Workspace
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 transition"
      >
        Log out
      </button>
    </header>
  );
}

export default Navbar;