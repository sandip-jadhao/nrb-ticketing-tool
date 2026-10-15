import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login({ email, password });
      
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("firstName", data.firstName || "");
      localStorage.setItem("lastName", data.lastName || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("mobileNo", data.mobileNo || "");
      localStorage.setItem("department", data.department || "IT");
      localStorage.setItem("designation", data.designation || "");

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "IT_ENGINEER") {
        navigate("/engineer/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        alert(err.response.data?.message || "Invalid Email or Password");
      } else {
        alert(err.message || "An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-[#FBFBF9] w-full max-w-sm rounded-2xl shadow-xl px-6 py-6 border border-gray-100 flex flex-col justify-center">
        {/* Header Branding */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#991B1B] flex justify-center items-center mx-auto mb-2 shadow-sm">
            <FaLock className="text-white" size={20} />
          </div>

          <img
            src="https://nrbindustrialbearings.com/img/logo.jpg"
            alt="NRB Industrial Bearings"
            className="h-10 object-contain mx-auto mb-1.5"
          />

          <h1 className="text-2xl font-bold text-[#991B1B] tracking-tight">
            IT Support
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#991B1B] hover:bg-[#7f1616] text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;