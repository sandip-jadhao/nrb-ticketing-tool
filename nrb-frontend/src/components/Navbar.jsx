function Navbar() {
  const role = localStorage.getItem("role");
  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";

  return (
<<<<<<< HEAD
    <div className="h-16 bg-white shadow flex items-center justify-end px-8">
=======
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold text-[#003B7A]">
        
      </h2>
>>>>>>> b333a12 (feat: add profiles and initialize data)

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
