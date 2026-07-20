import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getTickets, deleteTicket } from "../../services/adminService";

function Tickets() {

  const [tickets, setTickets] =
    useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response =
        await getTickets();
      setTickets(response.data);
      console.log("Tickets Data:", response.data);
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleDelete =
    async (id) => {
      try {
        await deleteTicket(id);
        loadTickets();
      }
      catch (error) {
        console.log(error);
      }
    };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 "> Tickets</h1>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto" >
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  SR No
                </th>

                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  Priority
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Created By
                </th>

                <th className="p-4 text-left">
                  Assigned Engineer
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {tickets.map((ticket,index) => (

                <tr
                  key={ticket.id}
                  className="
                  border-t
                  hover:bg-gray-50
                "
                >

                  <td className="p-4">
                    {index+1}
                  </td>

                  <td className="p-4">
                    {ticket.title}
                  </td>

                  <td className="p-4">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        text-white

                        ${
                          ticket.priority ===
                          "CRITICAL"
                            ? "bg-red-700"
                            : ticket.priority ===
                              "HIGH"
                            ? "bg-red-500"
                            : ticket.priority ===
                              "MEDIUM"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }
                      `}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.status}
                  </td>
                  <td className="p-4">
                    <div>
                      <p>
                        {
                          ticket.createdBy
                            ?.firstName
                        }{" "}
                        {
                          ticket.createdBy
                            ?.lastName
                        }
                      </p>

                      <p
                        className="
                        text-sm
                        text-gray-500
                      "
                      >
                        {
                          ticket.createdBy
                            ?.email
                        }
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    {
                      ticket.assignedEngineer ? (

                        <div>
                          <p>
                            {
                              ticket
                                .assignedEngineer
                                ?.firstName
                            }{" "}
                            {
                              ticket
                                .assignedEngineer
                                ?.lastName
                            }
                          </p>

                          <p
                            className="
                            text-sm
                            text-gray-500
                          "
                          >
                            {
                              ticket
                                .assignedEngineer
                                ?.email
                            }
                          </p>
                        </div>
                      ) : (
                        <span
                          className="
                          text-red-500
                        "
                        >
                          Unassigned
                        </span>
                      )
                    }
                  </td>
                  <td
                    className="
                    p-4
                    text-center
                  "
                  >
                    <button
                      onClick={() =>
                        handleDelete(
                          ticket.id
                        )
                      }
                      className="
                      bg-red-500
                      text-white
                      px-3
                      py-1
                      rounded
                      hover:bg-red-600
                    "
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}

export default Tickets;