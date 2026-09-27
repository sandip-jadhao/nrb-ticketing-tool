function Navbar() {
  const role = localStorage.getItem("role");
  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";

  return (
    <div className="h-16 bg-white shadow flex items-center justify-end px-8">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center text-white font-bold">
          {firstName.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-semibold">
            {firstName} {lastName}
          </p>
        </div>

      </div>

    </div>
  );
}

export default Navbar;
