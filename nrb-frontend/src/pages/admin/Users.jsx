import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getUsers, deleteUser, createUser } from "../../services/adminService";

function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    department: "",
    designation: "",
    role: "USER",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      const onlyUsers = response.data.filter((user) => user.role === "USER");
      setUsers(onlyUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
      console.log("FORM SUBMITTED");
    try {
      console.log("BEFORE API CALL");
     const response= await createUser(newUser);
      console.log("AFTER API CALL");
      console.log(response);
      loadUsers();

      setShowForm(false);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
        password: "",
        department: "",
        designation: "",
        role: "USER",
      });

      alert("User Created Successfully");
    } catch (error) {
    console.log("API ERROR");
    console.log(error);
    console.log(error.response);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Users Management</h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
        </div>
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Create User</h2>

            <form
              onSubmit={handleCreateUser}
              className="grid grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="mobileNo"
                placeholder="Mobile Number"
                value={newUser.mobileNo}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newUser.department}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={newUser.designation}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <select
                name="role"
                value={newUser.role}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="USER">USER</option>
                <option value="IT_ENGINEER">IT_ENGINEER</option>
              </select>

              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
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
                <th className="p-4 text-left">ID</th>

                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Department</th>

                <th className="p-4 text-center">Update</th>

                <th className="p-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index + 1}
                  className="
                    border-t
                    hover:bg-gray-50
                  "
                >
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4">{user.department}</td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="
                        bg-blue-500
                        text-white
                        px-3
                        py-1
                        rounded
                        hover:bg-blue-600
                      "
                    >
                      Update
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
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

export default Users;
