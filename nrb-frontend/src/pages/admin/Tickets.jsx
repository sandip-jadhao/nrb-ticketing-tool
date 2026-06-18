import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getTickets } from "../../services/adminService";

function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Tickets
        </h1>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#002855] text-white">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Priority</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created By</th>
                <th className="p-4 text-left">Assigned Engineer</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{ticket.id}</td>

                  <td className="p-4 font-medium">
                    {ticket.title}
                  </td>

                  <td className="p-4">
                    {ticket.description}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white
                      ${
                        ticket.priority === "CRITICAL"
                          ? "bg-red-600"
                          : ticket.priority === "HIGH"
                          ? "bg-orange-500"
                          : ticket.priority === "MEDIUM"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white
                      ${
                        ticket.status === "OPEN"
                          ? "bg-blue-500"
                          : ticket.status === "ASSIGNED"
                          ? "bg-indigo-500"
                          : ticket.status === "IN_PROGRESS"
                          ? "bg-yellow-500"
                          : ticket.status === "RESOLVED"
                          ? "bg-green-600"
                          : ticket.status === "CLOSED"
                          ? "bg-gray-600"
                          : "bg-red-500"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {ticket.createdBy?.firstName}{" "}
                    {ticket.createdBy?.lastName}
                  </td>

                  <td className="p-4">
                    {ticket.assignedEngineer
                      ? `${ticket.assignedEngineer.firstName} ${ticket.assignedEngineer.lastName}`
                      : "Not Assigned"}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded
                        hover:bg-blue-700
                      "
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No Tickets Found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Tickets;