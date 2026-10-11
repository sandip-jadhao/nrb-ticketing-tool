import Navbar from "../components/Navbar";
import EngineerSidebar from "../components/EngineerSidebar";

function EngineerLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">

      <EngineerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-hidden pl-6 pr-2 py-4 flex flex-col">
          {children}
        </main>

      </div>

    </div>
  );
}

export default EngineerLayout;