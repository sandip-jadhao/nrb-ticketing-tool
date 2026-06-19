import { useEffect,useState} from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {getEngineers,deleteEngineer}from "../../services/engineerService";
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
            const response = await getEngineers();
            setEngineers(response.data);
            
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
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Engineers</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Mobile
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {engineers.map(
                (engineer,index) => (

                <tr
                  key={index + 1}
                  className="
                  border-t
                  hover:bg-gray-50
                "
                >

                  <td className="p-4">
                    {index + 1}
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
                    {engineer.user?.mobileNo}
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
                          engineer.user?.id
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