function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold text-[#003B7A]">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center text-white font-bold">
          A
        </div>

        <div>
          <p className="font-semibold">
            System Admin
          </p>

          <p className="text-gray-500 text-sm">
            ADMIN
          </p>
        </div>

      </div>

    </div>
  );
}

export default Navbar;