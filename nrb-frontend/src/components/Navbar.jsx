import React from "react";

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

      {/* User Avatar & Name */}
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg  border-transparent hover:border-red-200 hover:bg-red-50/80 cursor-pointer transition-all duration-300 ease-in-out">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#9B1317] font-bold flex items-center justify-center text-s shadow-inner">
            {initials}
        </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              {firstName} {lastName}
            </span>
            <span className="text-[11px] text-gray-400 capitalize">
              {role.toLowerCase()}
            </span>
          </div>
      </div>
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