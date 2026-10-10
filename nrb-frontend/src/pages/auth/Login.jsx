import { useState } from "react";
import {FaLock} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);
        setError("");
      const response = await login({email,password});

      const token = response.data.token;
      const role = response.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("firstName", response.data.firstName);
      localStorage.setItem("lastName", response.data.lastName);
      localStorage.setItem("email", response.data.email);

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "IT_ENGINEER") {
        navigate("/engineer/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Email or Password");
    }finally {
      setLoading(false);
    }
  };

  return (

    <div
      className="
      min-h-screen
<<<<<<< HEAD
      bg-white
=======
      bg-gradient-to-br
      from-[#FBFBF9]
      to-[#FBFBF9]
>>>>>>> b333a12 (feat: add profiles and initialize data)
      flex
      justify-center
      items-center
      p-2
    "
    >

      <div
        className="
        bg-[#FBFBF9]
        w-full
        max-w-md
        rounded-3xl
        shadow-2xl
        p-7
      "
      >

        <div className="text-center mb-8">

          <div
            className="
            w-20
            h-20
            rounded-full
            bg-[#991B1B]
            flex
            justify-center
            items-center
            mx-auto
            mb-4
          "
          >
            <FaLock
              className="text-white"
              size={30}
            />
          </div>

  <img
  src="https://nrbindustrialbearings.com/img/logo.jpg"
  alt="NRB Industrial Bearings"
  className="w-30 h-30 object-contain mx-auto mb-3"
/>
          <h1
            className="
            text-3xl
            font-bold
            text-[#991B1B]
          "
          >
            NRB Support
          </h1> 
        </div>
        {error && (
          <div
            className="
            bg-red-100
            text-red-700
            p-3
            rounded-lg
            mb-3
          "
          >
            {error}
          </div>

        )}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <div>

            <label
              className="
              block
              mb-2
              font-medium
              text-gray-700
            "
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-[#003B7A]
              "
              required
            />

          </div>

          <div>

            <label
              className="
              block
              mb-2
              font-medium
              text-gray-700
            "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-[#003B7A]
              "
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
<<<<<<< HEAD
              bg-[#991B1B]
              hover:bg-[#991B1B]
=======
              bg-[#A6221D]
              hover:bg-[#A6221D]
>>>>>>> b333a12 (feat: add profiles and initialize data)
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;