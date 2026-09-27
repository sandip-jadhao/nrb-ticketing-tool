import { useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import { getTickets } from "../../services/ticketService";
import { formatDateTime } from "../../utils/dateTime";

function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await getTickets();
        setTickets(response.data);
      } catch (error) {
        console.error("Unable to load tickets", error);
      }
    };

    loadTickets();
  }, []);

  return (
    <UserLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tickets</h1>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Resolved</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Priority</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{ticket.id}</td>
                    <td className="p-4 whitespace-nowrap">
                      {formatDateTime(ticket.createdAt)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {formatDateTime(ticket.resolvedAt)}
                    </td>
                    <td className="p-4">{ticket.title}</td>
                    <td className="p-4">{ticket.priority}</td>
                    <td className="p-4">{ticket.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}

export default MyTickets;
