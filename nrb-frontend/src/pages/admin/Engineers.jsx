import { useEffect,useState} from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {getEngineers,deleteEngineer}from "../../services/adminService";
function Engineers() {

  const [engineers,
          setEngineers] =
    useState([]);

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers =
    async () => {

      try {

        const response =
          await getEngineers();

        setEngineers(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (id) => {

      try {

        await deleteEngineer(id);

        loadEngineers();

      } catch (error) {
        console.log(error);
      }
    };

  return (
    <AdminLayout>

      <div>

        <div
          className="
          flex
          justify-between
          mb-6
        "
        >
          <h1
            className="
            text-3xl
            font-bold
          "
          >
            Engineers
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
            Create Engineer
          </button>
        </div>

        <div
          className="
          bg-white
          rounded-lg
          shadow
          overflow-hidden
        "
        >
          <table className="w-full">

            <thead
              className="
              bg-gray-100
            "
            >
              <tr>

                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  Employee Code
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Skill Set
                </th>

                <th className="p-4 text-left">
                  Experience
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {engineers.map(
                (engineer) => (

                <tr
                  key={engineer.id}
                  className="
                  border-t
                  hover:bg-gray-50
                "
                >

                  <td className="p-4">
                    {engineer.id}
                  </td>

                  <td className="p-4">
                    {engineer.employeeCode}
                  </td>

                  <td className="p-4">
                    {engineer.user?.firstName}
                    {" "}
                    {engineer.user?.lastName}
                  </td>

                  <td className="p-4">
                    {engineer.user?.email}
                  </td>

                  <td className="p-4">
                    {engineer.skillSet}
                  </td>

                  <td className="p-4">
                    {engineer.experienceYears}
                    {" "}
                    Years
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
                          engineer.id
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

export default Engineers;