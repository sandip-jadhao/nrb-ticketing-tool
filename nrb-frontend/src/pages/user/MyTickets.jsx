import { useEffect, useState, useMemo } from "react";
import UserLayout from "../../layouts/UserLayout";
import { getTickets, viewAttachment, downloadAttachment } from "../../services/ticketService";
import { wsService } from "../../services/websocketService";
import { formatDateTime } from "../../utils/dateTime";
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

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [chatTicket, setChatTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    loadTickets();

    wsService.connect(() => {
      wsService.subscribe("/topic/tickets", () => {
        loadTickets();
      });
    });

    return () => {
      wsService.unsubscribe("/topic/tickets");
    };
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error("Unable to load tickets", error);
    }
  };

  // Sort: Active tickets first, followed by priority and recency
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

  // Pagination calculation
  const totalPages = Math.ceil(sortedTickets.length / pageSize) || 1;
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTickets.slice(startIndex, startIndex + pageSize);
  }, [sortedTickets, currentPage, pageSize]);

  return (
    <UserLayout>
      <div>
        {/* Header Summary */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Tickets</h1>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Total Tickets: {tickets.length.toLocaleString()}
          </span>
        </div>

        {/* Tickets Table */}
        <div className="w-full bg-white rounded-xl shadow-xs overflow-y-auto max-h-[calc(100vh-210px)] border border-gray-200">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-[#FAFBFD] sticky top-0 z-10 border-b border-gray-200 shadow-xs">
              <tr>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">ID</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Created</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Resolved</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Title</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Priority</th>
                <th className="p-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Attachment</th>
                <th className="p-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Chat</th>
                <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700">#{ticket.id}</td>

                    <td className="p-3.5 whitespace-nowrap text-gray-600">
                      {ticket.createdAt ? formatDateTime(ticket.createdAt) : "—"}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-gray-600">
                      {ticket.resolvedAt ? formatDateTime(ticket.resolvedAt) : "—"}
                    </td>

                    <td className="p-3.5 font-medium text-gray-900 max-w-xs truncate">
                      {ticket.title}
                    </td>

                    {/* Priority Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          ticket.priority === "LOW"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : ticket.priority === "HIGH"
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Attachment View/Download */}
                    <td className="p-3.5 text-center">
                      {ticket.attachmentPath ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => viewAttachment(ticket.attachmentPath)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer"
                            title="View attachment in browser"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadAttachment(ticket.attachmentPath)}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer"
                            title="Download file"
                          >
                            Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-300 italic">—</span>
                      )}
                    </td>

                    {/* Coordination Chat Button */}
                    <td className="p-3.5 text-center">
                      {ticket.status === "RESOLVED" ? (
                        <span className="text-[11px] text-gray-400 italic font-semibold">
                          Purged
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setChatTicket(ticket)}
                          className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#9B1317] border border-red-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                          title="Chat with Support Engineer"
                        >
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

                    {/* Status Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          ticket.status === "RESOLVED"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : ticket.status === "REJECTED"
                            ? "bg-gray-100 text-gray-700 border border-gray-200"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : ticket.status === "ASSIGNED"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-1 select-none">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-[#9B1317]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">
              Showing {sortedTickets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedTickets.length)} of {sortedTickets.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Coordination Chat Modal */}
      {chatTicket && (
        <TicketChatModal
          ticket={chatTicket}
          onClose={() => setChatTicket(null)}
        />
      )}
    </UserLayout>
  );
}

export default MyTickets;