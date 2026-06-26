import { useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import { createTicket } from "../../services/ticketService";

function CreateTicket() {

  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "LOW",
  });

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await createTicket(ticket);

      alert("Ticket Created Successfully");

      setTicket({
        title: "",
        description: "",
        priority: "LOW",
      });

    } catch (error) {
      console.log(error);
      alert("Failed to create ticket");
    }
  };

  return (
    <UserLayout>

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create Ticket
        </h1>

        <div className="bg-white rounded-lg shadow p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="block mb-2 font-medium">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={ticket.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="Enter ticket title"
                required
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                rows="6"
                name="description"
                value={ticket.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="Describe your issue"
                required
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Priority
              </label>

              <select
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Create Ticket
            </button>

          </form>

        </div>

      </div>

    </UserLayout>
  );
}

export default CreateTicket;