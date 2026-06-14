import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { login } from "../../services/authService";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response =
        await login({
          email,
          password,
        });

      const token =
        response.data.token;

      localStorage.setItem(
        "token",
        token
      );

      alert("Login Successful");

    } catch {

      setError(
        "Invalid Email or Password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#002855]
      to-[#003B7A]
      flex
      justify-center
      items-center
      p-4
    "
    >

      <div
        className="
        bg-white
        w-full
        max-w-md
        rounded-3xl
        shadow-2xl
        p-10
      "
      >

        <div className="text-center mb-8">

          <div
            className="
            w-20
            h-20
            rounded-full
            bg-[#003B7A]
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

          <h1
            className="
            text-3xl
            font-bold
            text-[#003B7A]
          "
          >
            NRB Support
          </h1>

          <p className="text-gray-500 mt-2">
            IT Support Ticketing System
          </p>

        </div>

        {error && (

          <div
            className="
            bg-red-100
            text-red-700
            p-3
            rounded-lg
            mb-5
          "
          >
            {error}
          </div>

        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
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
              bg-[#003B7A]
              hover:bg-[#002855]
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