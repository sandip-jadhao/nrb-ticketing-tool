import axios from "axios";

const API_BASE = "http://localhost:8080/api/tickets";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all coordination messages for a specific ticket
 */
export const getTicketMessages = (ticketId) => {
  return axios.get(`${API_BASE}/${ticketId}/messages`, getAuthHeaders());
};

/**
 * Send a coordination message for a specific ticket
 */
export const sendTicketMessage = (ticketId, message) => {
  return axios.post(
    `${API_BASE}/${ticketId}/messages`,
    { message },
    getAuthHeaders()
  );
};