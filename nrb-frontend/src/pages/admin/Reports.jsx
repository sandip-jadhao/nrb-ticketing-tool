import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaRedo } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import { getTickets } from "../../services/adminService";
import { formatDateTime } from "../../utils/dateTime";

function Reports() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await getTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error("Failed to load tickets for reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets by Search Query AND Start/End Date Range
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // 1. Date Range Filter (based on Created At)
        if (startDate || endDate) {
          if (!ticket.createdAt) return false;
          const ticketTime = new Date(ticket.createdAt).getTime();

          if (startDate) {
            const start = new Date(`${startDate}T00:00:00`).getTime();
            if (ticketTime < start) return false;
          }

          if (endDate) {
            const end = new Date(`${endDate}T23:59:59.999`).getTime();
            if (ticketTime > end) return false;
          }
        }

        // 2. Search Box Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const idMatch = String(ticket.id || "").toLowerCase().includes(q);
          const titleMatch = (ticket.title || "").toLowerCase().includes(q);
          const descMatch = (ticket.description || "").toLowerCase().includes(q);
          const priorityMatch = (ticket.priority || "").toLowerCase().includes(q);
          const statusMatch = (ticket.status || "").toLowerCase().includes(q);
          const createdByName = `${ticket.createdBy?.firstName || ""} ${ticket.createdBy?.lastName || ""}`.toLowerCase();
          const engineerName = ticket.assignedEngineer
            ? `${ticket.assignedEngineer?.firstName || ""} ${ticket.assignedEngineer?.lastName || ""}`.toLowerCase()
            : "unassigned";

          return (
            idMatch ||
            titleMatch ||
            descMatch ||
            priorityMatch ||
            statusMatch ||
            createdByName.includes(q) ||
            engineerName.includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
        const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
        return timeB - timeA;
      });
  }, [tickets, searchQuery, startDate, endDate]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTickets.slice(startIndex, startIndex + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  // Download filtered tickets as Excel (.xlsx) including Description
  const handleDownloadExcel = () => {
    if (filteredTickets.length === 0) {
      alert("No tickets found for the selected filter criteria.");
      return;
    }

    const excelData = filteredTickets.map((ticket, index) => ({
      "S.N.": index + 1,
      "Ticket ID": `#${ticket.id}`,
      "Title": ticket.title || "—",
      "Description": ticket.description || "—",
      "Priority": ticket.priority || "—",
      "Status": ticket.status || "—",
      "Created By": ticket.createdBy
        ? `${ticket.createdBy.firstName || ""} ${ticket.createdBy.lastName || ""}`.trim()
        : "—",
      "Assigned Engineer": ticket.assignedEngineer
        ? `${ticket.assignedEngineer.firstName || ""} ${ticket.assignedEngineer.lastName || ""}`.trim()
        : "Unassigned",
      "Created At": ticket.createdAt ? formatDateTime(ticket.createdAt) : "—",
      "Resolved At": ticket.resolvedAt ? formatDateTime(ticket.resolvedAt) : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set readable column widths in Excel (added 45 width for Description)
    worksheet["!cols"] = [
      { wch: 6 },  // S.N.
      { wch: 12 }, // Ticket ID
      { wch: 30 }, // Title
      { wch: 45 }, // Description
      { wch: 12 }, // Priority
      { wch: 15 }, // Status
      { wch: 22 }, // Created By
      { wch: 22 }, // Assigned Engineer
      { wch: 22 }, // Created At
      { wch: 22 }, // Resolved At
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Reports");

    const rangeLabel =
      startDate && endDate
        ? `${startDate}_to_${endDate}`
        : startDate
        ? `From_${startDate}`
        : endDate
        ? `UpTo_${endDate}`
        : "All_Dates";

    XLSX.writeFile(workbook, `NRB_Call_Report_${rangeLabel}.xlsx`);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        {/* Header & Total Count */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-gray-800">Call Reports</h1>
          <span className="text-sm text-gray-500 font-medium">
            Matching Tickets: {filteredTickets.length.toLocaleString()}
          </span>
        </div>

        {/* Filter & Export Toolbar */}
        <div className="bg-white p-3.5 rounded-lg shadow-sm border border-gray-200 mb-4 flex flex-wrap items-end justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
              Search Tickets
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, title, description, user, engineer, status..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#9B1317]"
              />
            </div>
          </div>

          {/* Date Range Selectors & Buttons */}
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#9B1317] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#9B1317] cursor-pointer"
              />
            </div>

            {(searchQuery || startDate || endDate) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1.5 transition cursor-pointer"
                title="Clear Filters"
              >
                <FaRedo className="text-[10px]" />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={filteredTickets.length === 0}
              className="bg-[#9B1317] hover:bg-[#800f13] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <FaFileExcel className="text-sm" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Simple Tickets Table */}
        <div className="w-full bg-white rounded-lg shadow overflow-y-auto max-h-[calc(100vh-265px)] border border-gray-200">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">S.N.</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Ticket ID</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Title</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Created At</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Resolved At</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Priority</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Created By</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Assigned Engineer</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500 text-sm">
                    Loading ticket reports...
                  </td>
                </tr>
              ) : paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500 text-sm">
                    No tickets match the selected date range or search query.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-sm text-gray-600">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 text-sm font-bold text-gray-700">
                      #{ticket.id}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-600">
                      {ticket.createdAt ? formatDateTime(ticket.createdAt) : "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-600">
                      {ticket.resolvedAt ? formatDateTime(ticket.resolvedAt) : "—"}
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
              Showing {filteredTickets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredTickets.length)} of {filteredTickets.length}
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
    </AdminLayout>
  );
}

export default Reports;