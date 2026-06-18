import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getUsers,
  deleteUser
} from "../../services/adminService";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
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
          <h1 className="text-3xl font-bold">
            Users Management
          </h1>

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
            Create User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Department
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-center">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="
                    border-t
                    hover:bg-gray-50
                  "
                >
                  <td className="p-4">
                    {user.id}
                  </td>

                  <td className="p-4">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.department}
                  </td>

                  <td className="p-4">
                    {user.role}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        handleDelete(user.id)
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

export default Users;