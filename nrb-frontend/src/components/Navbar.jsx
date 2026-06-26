import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const role = localStorage.getItem("role");
  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";

  const pageTitle = location.pathname
    .split("/")
    .pop()
    .replace("-", " ");

  const title =
    pageTitle.charAt(0).toUpperCase() +
    pageTitle.slice(1);

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold text-[#003B7A]">
        {title}
      </h2>

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center text-white font-bold">
          {firstName.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-semibold">
            {firstName} {lastName}
          </p>

          <p className="text-gray-500 text-sm">
            {role}
          </p>
        </div>

      </div>

    </div>
  );
}

export default Navbar;