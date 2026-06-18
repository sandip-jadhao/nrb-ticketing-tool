import axios from "axios";

const API =
  "http://localhost:8080/api/admin";

// helper to get auth headers (reads token fresh from localStorage)
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getDashboardData = async () => {
  const response = await axios.get(`${API}/dashboard`, getHeaders());
  return response.data;
};

export const getUsers = () => {
  return axios.get(`${API}/users`, getHeaders());
};

export const createUser = (user) => {
  return axios.post(`${API}/users`, user, getHeaders());
};

export const deleteUser = (id) => {
  return axios.delete(`${API}/users/${id}`, getHeaders());
};

export const getEngineers = () => {
  return axios.get(`${API}/engineers`, getHeaders());
};

export const createEngineer = (engineer) => {
  return axios.post(`${API}/engineers`, engineer, getHeaders());
};

export const deleteEngineer = (id) => {
  return axios.delete(`${API}/engineers/${id}`, getHeaders());
};

export const getTickets = () => {
  return axios.get(`${API}/tickets`, getHeaders());
};