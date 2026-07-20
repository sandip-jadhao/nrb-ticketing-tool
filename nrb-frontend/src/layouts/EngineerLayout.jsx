import Navbar from "../components/Navbar";
import EngineerSidebar from "../components/EngineerSidebar";

function EngineerLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <EngineerSidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default EngineerLayout;