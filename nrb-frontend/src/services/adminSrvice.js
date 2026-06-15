import axios from "axios";

const API =
  "http://localhost:8080/api/admin";

const token =
  localStorage.getItem("token");

export const getUsers = () => {
  return axios.get(
    `${API}/users`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );
};