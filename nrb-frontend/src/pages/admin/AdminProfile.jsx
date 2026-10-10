import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getProfile } from "../../services/adminService";

function AdminProfile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const data = await getProfile();

        console.log("ADMIN PROFILE:", data);

        setProfile(data);

      } catch (error) {

        console.error("Profile loading error:", error);

        setError("Unable to load profile.");

      } finally {

        setLoading(false);
      }
    };

    loadProfile();

  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          Loading profile...
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8 text-red-500">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

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
                {profile.designation}
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
                Mobile Number
              </p>

              <p className="font-semibold">
                {profile.mobileNo}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="font-semibold">
                {profile.department}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Designation
              </p>

              <p className="font-semibold">
                {profile.designation}
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

    </AdminLayout>
  );
}

export default AdminProfile;