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
        setProfile(data);
      } catch (err) {
        console.error("Profile loading error:", err);
        setError("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-[#9B1317] rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Loading Profile...
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !profile) {
    return (
      <AdminLayout>
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold max-w-xl">
          {error || "Profile could not be found."}
        </div>
      </AdminLayout>
    );
  }

  const initials = `${profile.firstName?.charAt(0) || ""}${
    profile.lastName?.charAt(0) || ""
  }`.toUpperCase() || "SA";

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  const lastSigned = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <AdminLayout>
      {/* Scrollable Container Wrapper */}
      <div className="w-full h-full overflow-y-auto pr-2 pb-16 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* ===================== CRIMSON HERO HEADER ===================== */}
          <div className="bg-[#8B0E12] rounded-2xl px-8 py-7 shadow-md flex items-center gap-6 text-white">
            <div className="w-20 h-20 rounded-2xl bg-white text-[#8B0E12] font-black text-2xl flex items-center justify-center shrink-0 shadow-lg tracking-tight select-none">
              {initials}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200/80 block">
                MY PROFILE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {fullName}
              </h1>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-white/90">
                  {"Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* ===================== PERSONAL DETAILS CARD ===================== */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8 space-y-6">
            <div className="flex justify-between items-start pb-5 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-[#9B1317] uppercase block mb-1">
                  ACCOUNT INFORMATION
                </span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Personal Details
                </h2>
              </div>

              <div className="p-2 text-[#9B1317] bg-red-50 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    FULL NAME
                  </span>
                  <span className="text-sm font-bold text-gray-900">{fullName}</span>
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    EMAIL ADDRESS
                  </span>
                  <span className="text-sm font-bold text-gray-900">{profile.email || "—"}</span>
                </div>
              </div>

              {/* Role */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    ROLE
                  </span>
                  <span className="text-sm font-bold text-gray-900">{profile.role || "Admin"}</span>
                </div>
              </div>

              {/* Status */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    STATUS
                  </span>
                  <span className="text-sm font-bold text-gray-900">Approved</span>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    MOBILE NUMBER
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {profile.mobileNo || "Not Provided"}
                  </span>
                </div>
              </div>

              {/* Department & Designation */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    DEPARTMENT / DESIGNATION
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {profile.department || "IT"} {profile.designation ? `· ${profile.designation}` : ""}
                  </span>
                </div>
              </div>

              {/* Last Signed In */}
              <div className="bg-[#FAFBFD] border border-gray-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#9B1317] flex items-center justify-center shrink-0 border border-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    LAST SIGNED IN
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {lastSigned}, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Administration Note */}
            <p className="text-xs text-gray-400 pt-4 leading-relaxed border-t border-gray-100">
              Your name and email are managed by an administrator. Ask them if either needs changing — your email is also how you sign in. If the last sign-in was not you, tell an administrator.
            </p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;