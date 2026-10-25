import { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getTickets, deleteTicket } from "../../services/adminService";
import { wsService } from "../../services/websocketService";
import { formatDateTime } from "../../utils/dateTime";
import { viewAttachment, downloadAttachment } from "../../services/ticketService";
import TicketChatModal from "../../components/TicketChatModal";

const STATUS_WEIGHTS = {
  OPEN: 0,
  ASSIGNED: 0,
  IN_PROGRESS: 0,
  RESOLVED: 1,
  REJECTED: 1,
};

const PRIORITY_WEIGHTS = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [chatTicket, setChatTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [unreadSet, setUnreadSet] = useState(new Set());

  const loadTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTickets();

    wsService.connect(() => {
      wsService.subscribe("/topic/tickets", (incomingTicket) => {
        if (incomingTicket.userDeleted) {
          loadTickets();
          return;
        }

        if (incomingTicket.deletedTicketId) {
          setTickets((prev) => prev.filter((t) => t.id !== incomingTicket.deletedTicketId));
          return;
        }

        if (incomingTicket.id) {
          setTickets((prev) => {
            const index = prev.findIndex((t) => t.id === incomingTicket.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = incomingTicket;
              return updated;
            }
            return [incomingTicket, ...prev];
          });
        }
      });
    });

    return () => {
      wsService.unsubscribe("/topic/tickets");
    };
  }, []);

  // Listen to live chat message topics for all loaded tickets to trigger unread indicators
  useEffect(() => {
    if (tickets.length === 0) return;

    wsService.connect(() => {
      tickets.forEach((ticket) => {
        if (ticket.status !== "RESOLVED") {
          wsService.subscribe(`/topic/ticket-messages/${ticket.id}`, () => {
            // If the chat modal for this ticket is NOT currently open, mark as unread
            if (chatTicket?.id !== ticket.id) {
              setUnreadSet((prev) => new Set(prev).add(ticket.id));
            }
          });
        }
      });
    });

    return () => {
      tickets.forEach((ticket) => {
        wsService.unsubscribe(`/topic/ticket-messages/${ticket.id}`);
      });
    };
  }, [tickets, chatTicket]);

  const handleOpenChat = (ticket) => {
    setChatTicket(ticket);
    // Clear unread badge when opening chat
    setUnreadSet((prev) => {
      const next = new Set(prev);
      next.delete(ticket.id);
      return next;
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const statusA = STATUS_WEIGHTS[a.status] ?? 0;
      const statusB = STATUS_WEIGHTS[b.status] ?? 0;
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      const priorityA = PRIORITY_WEIGHTS[a.priority] ?? 4;
      const priorityB = PRIORITY_WEIGHTS[b.priority] ?? 4;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return timeB - timeA;
    });
  }, [tickets]);

  const totalPages = Math.ceil(sortedTickets.length / pageSize) || 1;
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTickets.slice(startIndex, startIndex + pageSize);
  }, [sortedTickets, currentPage, pageSize]);

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Tickets</h1>
          <span className="text-sm text-gray-500 font-medium">
            Total Tickets: {tickets.length.toLocaleString()}
          </span>
        </div>

        {/* Scrollable Container with Sticky Table Header */}
        <div className="w-full bg-white rounded-lg shadow overflow-y-auto max-h-[calc(100vh-200px)] border border-gray-200">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">S.N.</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Title</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Created At</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Priority</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Resolved At</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Created By</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Assigned Engineer</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Attachment</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Chat</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-6 text-center text-gray-500">
                    No tickets available.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-gray-600">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 font-medium text-gray-900">{ticket.title}</td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(ticket.createdAt)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${
                          ticket.priority === "CRITICAL"
                            ? "bg-red-600"
                            : ticket.priority === "HIGH"
                            ? "bg-orange-400"
                            : ticket.priority === "MEDIUM"
                            ? "bg-amber-600"
                            : "bg-green-600"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          ticket.status === "RESOLVED"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "REJECTED"
                            ? "bg-gray-200 text-gray-700"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-600">
                      {ticket.resolvedAt ? formatDateTime(ticket.resolvedAt) : "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {ticket.assignedEngineer ? (
                        `${ticket.assignedEngineer?.firstName} ${ticket.assignedEngineer?.lastName}`
                      ) : (
                        <span className="text-red-500 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {ticket.attachmentPath ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => viewAttachment(ticket.attachmentPath)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
                            title="View attachment in browser"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadAttachment(ticket.attachmentPath)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
                            title="Download file"
                          >
                            Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">—</span>
                      )}
                    </td>

                    {/* Chat Coordination Column with Unread Indicator Badge */}
                    <td className="p-3 text-center">
                      {ticket.status === "RESOLVED" ? (
                        <span className="text-[11px] text-gray-400 italic font-semibold">
                          Purged
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenChat(ticket)}
                          className="relative inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#9B1317] border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                          title="Join Ticket Discussion"
                        >
                          {unreadSet.has(ticket.id) && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </span>
                          )}

                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>Discuss</span>
                        </button>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-800 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>
              Showing {sortedTickets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedTickets.length)} of {sortedTickets.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Coordination Chat Modal Mounted Here */}
      {chatTicket && (
        <TicketChatModal
          ticket={chatTicket}
          onClose={() => setChatTicket(null)}
        />
      )}
    </AdminLayout>
  );
}

export default Tickets;