import axios from "axios";

const ENGINEER_API = "http://localhost:8080/api/engineers";
const TICKET_API = "http://localhost:8080/api/tickets";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Engineer CRUD
export const getEngineers = () => {
  return axios.get(ENGINEER_API, getHeaders());
};

export const createEngineer = (engineer) => {
  return axios.post(ENGINEER_API, engineer, getHeaders());
};

export const deleteEngineer = (id) => {
  return axios.delete(`${ENGINEER_API}/${id}`, getHeaders());
};

// Logged-in Engineer Profile
export const getEngineerProfile = () => {
  return axios.get(`${ENGINEER_API}/profile`, getHeaders());
};

// Assigned Tickets
export const getEngineerTickets = () => {
  return axios.get(`${TICKET_API}/assigned`, getHeaders());
};

// Update Ticket Status
export const updateTicketStatus = (id, status) => {
  return axios.put(
    `${TICKET_API}/${id}/status?status=${status}`,
    {},
    getHeaders()
  );
};