import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Engineers from "./pages/admin/Engineers";
import Tickets from "./pages/admin/Tickets";

import EngineerDashboard from "./pages/engineer/Dashboard";

import UserDashboard from "./pages/user/UserDashboard";
import CreateTicket from "./pages/user/CreateTicket";
import UserProfile from "./pages/user/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/engineers" element={<Engineers />} />
        <Route path="/admin/tickets" element={<Tickets />} />
        <Route path="/engineer/dashboard" element={<EngineerDashboard />} />

        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/create-ticket" element={<CreateTicket />} />
        <Route path="/user/profile" element={<UserProfile />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
