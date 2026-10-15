import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTickets } from "../services/ticketService";
import { wsService } from "../services/websocketService";

function Navbar() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [maxTicketId, setMaxTicketId] = useState(0);

  // User details
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const userEmail = localStorage.getItem("email") || "";

  const isSupportStaff = role === "ADMIN" || role === "IT_ENGINEER" || role === "ENGINEER";

  // Dynamic Profile Route
  const profileRoute = (() => {
    if (role === "ADMIN") return "/admin/AdminProfile";
    if (role === "IT_ENGINEER" || role === "ENGINEER") return "/engineer/EngineerProfile";
    return "/user/profile";
  })();

  // Dynamic Tickets Table Route
  const ticketsTableRoute = (() => {
    if (role === "ADMIN") return "/admin/tickets";
    if (role === "IT_ENGINEER" || role === "ENGINEER") return "/engineer/tickets";
    return "/user/tickets";
  })();

  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  // Calculate notifications based on role
  const calculateNotifications = (tickets) => {
    if (!tickets || tickets.length === 0) {
      setUnreadCount(0);
      return;
    }

    if (isSupportStaff) {
      // -------------------------------------------------------------
      // ADMIN & ENGINEER LOGIC (SHARED SUPPORT TEAM COUNTER)
      // -------------------------------------------------------------
      const highestId = Math.max(...tickets.map((t) => t.id || 0), 0);
      setMaxTicketId(highestId);

      const savedLastChecked = localStorage.getItem("support_last_checked_ticket_id");

      if (savedLastChecked === null) {
        // First run: Count all pending (unresolved) tickets
        const pending = tickets.filter(
          (t) => t.status !== "RESOLVED" && t.status !== "REJECTED"
        );
        setUnreadCount(pending.length);
      } else {
        const lastCheckedId = parseInt(savedLastChecked, 10) || 0;
        // Count tickets created after the last checked ID that are still active
        const newTickets = tickets.filter(
          (t) =>
            t.id > lastCheckedId &&
            t.status !== "RESOLVED" &&
            t.status !== "REJECTED"
        );
        setUnreadCount(newTickets.length);
      }
    } else {
      // -------------------------------------------------------------
      // REGULAR USER LOGIC (Notified when their ticket is RESOLVED)
      // -------------------------------------------------------------
      const storageKey = `user_read_resolved_${userEmail}`;
      const readResolvedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

      const resolvedTickets = tickets.filter(
        (t) => t.createdBy?.email === userEmail && t.status === "RESOLVED"
      );

      const unread = resolvedTickets.filter((t) => !readResolvedIds.includes(t.id));
      setUnreadCount(unread.length);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await getTickets();
      calculateNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tickets for navbar notification:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // 1. Listen for WebSocket events (ticket creations, updates, or team resets)
    wsService.connect(() => {
      wsService.subscribe("/topic/tickets", (eventData) => {
        try {
          const payload =
            typeof eventData === "string" ? JSON.parse(eventData) : eventData?.body ? JSON.parse(eventData.body) : eventData;

          // If another support member cleared the badge
          if (payload && payload.action === "SUPPORT_NOTIFICATIONS_CLEARED") {
            if (isSupportStaff) {
              localStorage.setItem("support_last_checked_ticket_id", payload.lastCheckedId);
              setUnreadCount(0);
              return;
            }
          }
        } catch (e) {
          // Normal ticket payload
        }

        loadNotifications();
      });
    });

    // 2. Multi-tab synchronization (if testing Admin & Engineer across tabs in same browser)
    const handleStorageChange = (e) => {
      if (e.key === "support_last_checked_ticket_id") {
        loadNotifications();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      wsService.unsubscribe("/topic/tickets");
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [role, userEmail]);

  // Handle Bell Click
  const handleBellClick = () => {
    if (isSupportStaff) {
      // Set the shared checkpoint to the latest ticket ID
      localStorage.setItem("support_last_checked_ticket_id", maxTicketId.toString());
      setUnreadCount(0);

      // Broadcast clear event to other sessions/tabs via WebSocket
      try {
        if (wsService.send) {
          wsService.send("/topic/tickets", {
            action: "SUPPORT_NOTIFICATIONS_CLEARED",
            lastCheckedId: maxTicketId,
          });
        }
      } catch (err) {
        console.warn("Could not broadcast reset over WebSocket:", err);
      }
    } else {
      // Regular user marks their resolved tickets as read
      getTickets().then((res) => {
        const myResolved = (res.data || [])
          .filter((t) => t.createdBy?.email === userEmail && t.status === "RESOLVED")
          .map((t) => t.id);

        localStorage.setItem(`user_read_resolved_${userEmail}`, JSON.stringify(myResolved));
        setUnreadCount(0);
      });
    }

    // Open corresponding tickets table
    navigate(ticketsTableRoute);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between select-none">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tracking-wider uppercase text-gray-400">
          NRB Support System
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* ================= BELL NOTIFICATION BUTTON ================= */}
        <button
          type="button"
          onClick={handleBellClick}
          className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none cursor-pointer group"
          title={`Open ${isSupportStaff ? (role === "ADMIN" ? "Admin" : "Engineer") : "My"} Tickets`}
        >
          {/* Bell Icon */}
          <svg
            className="w-6 h-6 transform group-hover:scale-105 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* Crimson Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-[#9B1317] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* ================= PROFILE PILL LINK ================= */}
        <Link
          to={profileRoute}
          title="View Profile"
          className="flex items-center gap-3.5 bg-[#FAF6F6] hover:bg-[#F3EBEB] px-4 py-1.5 rounded-2xl border border-red-100/60 transition cursor-pointer group shadow-sm"
        >
          <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#9B1317] font-extrabold text-xs border border-gray-100 group-hover:scale-105 transition-transform shrink-0">
            {initials}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-gray-800 group-hover:text-[#9B1317] transition-colors">
              {firstName} {lastName}
            </span>
            <span className="text-[10px] text-gray-400 capitalize">
              {role ? role.toLowerCase().replace("_", " ") : "user"}
            </span>
          </div>
        </Link>

        {/* ================= LOGOUT BUTTON ================= */}
        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition shadow-sm"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;