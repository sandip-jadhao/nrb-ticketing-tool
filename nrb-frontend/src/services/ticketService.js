import axios from "axios";

const API = "http://localhost:8080/api/tickets";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTicket = (ticket) => {
  return axios.post(API, ticket, getHeaders());
};

export const getTickets = () => {
  return axios.get(`${API}/my`, getHeaders());
};