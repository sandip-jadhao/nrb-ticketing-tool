import axios from "axios";

const API = "http://localhost:8080/api/user";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUserDashboard = async () => {
  const response = await axios.get(
    `${API}/dashboard`,
    getHeaders()
  );
  return response.data;
};