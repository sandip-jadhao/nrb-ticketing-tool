import { useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import { getUserProfile } from "../../services/userService";

function UserProfile() {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    department: "",
    designation: "",
    role: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response);
      console.log("Profile:", response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserLayout>

      <div>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl">

          <div className="flex items-center gap-6 mb-8">

            <div className="w-20 h-20 rounded-full bg-[#F58220] flex items-center justify-center text-white text-3xl font-bold">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-gray-500">
                {user.role}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">First Name</p>
              <p className="font-semibold">
                {user.firstName}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Last Name</p>
              <p className="font-semibold">
                {user.lastName}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Mobile Number</p>
              <p className="font-semibold">
                {user.mobileNo}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Department</p>
              <p className="font-semibold">
                {user.department}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Designation</p>
              <p className="font-semibold">
                {user.designation}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-semibold">
                {user.role}
              </p>
            </div>

          </div>

        </div>
      </div>

    </UserLayout>
  );
}

export default UserProfile;