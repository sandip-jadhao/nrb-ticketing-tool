import { useEffect, useState } from "react";
import EngineerLayout from "../../layouts/EngineerLayout";

function EngineerProfile() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    const firstName = localStorage.getItem("firstName") || "";
    const lastName = localStorage.getItem("lastName") || "";
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "";

    setProfile({
      firstName,
      lastName,
      email,
      role
    });

  }, []);

  if (!profile) {
    return (
      <EngineerLayout>
        <div className="p-8">
          Loading profile...
        </div>
      </EngineerLayout>
    );
  }

  return (
    <EngineerLayout>

      <div className="p-8">

        <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">

          {/* Profile Header */}

          <div className="flex items-center gap-5 mb-8">

            <div className="w-20 h-20 rounded-full bg-[#F58220] flex items-center justify-center text-white text-3xl font-bold">
              {profile.firstName?.charAt(0).toUpperCase()}
            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#003B7A]">
                {profile.firstName} {profile.lastName}
              </h1>

              <p className="text-gray-500">
                IT Engineer
              </p>

              <p className="text-sm text-gray-500">
                {profile.role}
              </p>

            </div>

          </div>


          {/* Profile Details */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                First Name
              </p>

              <p className="font-semibold">
                {profile.firstName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Last Name
              </p>

              <p className="font-semibold">
                {profile.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-semibold">
                {profile.role}
              </p>
            </div>

          </div>

        </div>

      </div>

    </EngineerLayout>
  );
}

export default EngineerProfile;