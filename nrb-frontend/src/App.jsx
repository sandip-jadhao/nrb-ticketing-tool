import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Engineers from "./pages/admin/Engineers";
import Tickets from "./pages/admin/Tickets";
import AdminProfile from "./pages/admin/AdminProfile";
import Reports from "./pages/admin/Reports";

import EngineerDashboard from "./pages/engineer/EngineerDashboard";
import AssignedTickets from "./pages/engineer/AssignedTickets";
import EngineerProfile from "./pages/engineer/EngineerProfile";

import UserDashboard from "./pages/user/UserDashboard";
import CreateTicket from "./pages/user/CreateTicket";
import UserProfile from "./pages/user/UserProfile";
import MyTickets from "./pages/user/MyTickets";


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
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
        <Route path="/admin/AdminProfile" element={<AdminProfile/>}/>

        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/create-ticket" element={<CreateTicket />} />
        <Route path="/user/profile" element={<UserProfile />} /> 
        <Route path="/user/tickets" element={<MyTickets />} />

        <Route path="/engineer/tickets" element={<AssignedTickets />}/>
        <Route path="/engineer/EngineerProfile" element={<EngineerProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
