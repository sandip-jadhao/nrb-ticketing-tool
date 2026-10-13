import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getUsers, deleteUser, createUser} from "../../services/adminService";
import { wsService } from "../../services/websocketService";

function Engineers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    department: "IT",
    designation: "",
    role: "IT_ENGINEER",
  });

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      const engineers = response.data.filter(
        (user) => user.role === "IT_ENGINEER"
      );
      setUsers(engineers);
    } catch (error) {
      console.error("Failed to load engineers:", error);
    }
  };

  useEffect(() => {
    loadUsers();

    // Subscribe to real-time user events
    wsService.connect(() => {
      wsService.subscribe("/topic/users", (incoming) => {
        if (incoming.deletedUserId) {
          // Instantly filter out deleted engineer
          setUsers((prev) => prev.filter((u) => u.id !== incoming.deletedUserId));
        } else if (incoming.role === "IT_ENGINEER") {
          // Add or update engineer in real time
          setUsers((prev) => {
            const index = prev.findIndex((u) => u.id === incoming.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = incoming;
              return updated;
            }
            return [incoming, ...prev];
          });
        } else {
          loadUsers();
        }
      });
    });

    return () => {
      wsService.unsubscribe("/topic/users");
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete engineer:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      password: "",
      department: "IT",
      designation: "",
      role: "IT_ENGINEER",
    });
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNo: user.mobileNo || "",
      password: "",
      department: user.department || "IT",
      designation: user.designation || "",
      role: user.role,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setShowForm(false);
      loadUsers();
    } catch (error) {
      console.error("Error saving engineer:", error);
      alert("Failed to save engineer details");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between mb-6">
          <h1 className="text-1xl font-bold">Engineers</h1>

          <button
            onClick={handleCreate}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
          >
            Create Engineer
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? "Update Engineer" : "Create Engineer"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="mobileNo"
                placeholder="Mobile Number"
                value={formData.mobileNo}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              {!editingUser && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              )}

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <div className="col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                >
                  {editingUser ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">SR No</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Mobile</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-center">Update</th>
                <th className="p-4 text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No engineers found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.mobileNo || "—"}</td>
                    <td className="p-4 text-gray-600">{user.department}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition text-sm"
                      >
                        Update
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-900 transition text-sm"
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
      </div>
    </AdminLayout>
  );
}

export default Engineers;