import { useEffect, useState } from "react";
import EngineerLayout from "../../layouts/EngineerLayout";
import {getEngineerTickets,updateTicketStatus,} from "../../services/engineerService";

function AssignedTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getEngineerTickets();
      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
      loadTickets();
    } catch (error) {
      console.log(error);
      alert("Unable to update ticket status");
    }
  };

  return (
    <EngineerLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Assigned Tickets
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>

                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  Priority
                </th>

                <th className="p-4 text-left">
                  Created By
                </th>

                <th className="p-4 text-left">
                  Current Status
                </th>

                <th className="p-4 text-center">
                  Update Status
                </th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500"
                  >
                    No Assigned Tickets
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {index + 1}
                    </td>

                    <td className="p-4">
                      {ticket.title}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm
                        ${
                          ticket.priority === "LOW"
                            ? "bg-green-500"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-500"
                            : ticket.priority === "HIGH"
                            ? "bg-orange-500"
                            : "bg-red-600"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="p-4">
                      {ticket.createdBy?.firstName}{" "}
                      {ticket.createdBy?.lastName}
                    </td>

                    <td className="p-4">
                      {ticket.status}
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(
                            ticket.id,
                            e.target.value
                          )
                        }
                        className="border rounded px-3 py-2"
                      >
                        <option value="ASSIGNED">
                          ASSIGNED
                        </option>

                        <option value="IN_PROGRESS">
                          IN_PROGRESS
                        </option>

                        <option value="RESOLVED">
                          RESOLVED
                        </option>

                        <option value="REJECTED">
                          REJECTED
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </EngineerLayout>
  );
}

export default AssignedTickets;