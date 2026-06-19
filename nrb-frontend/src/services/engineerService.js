import axios from "axios";

const API = "http://localhost:8080/api/engineers";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getEngineers = () => {
  return axios.get(API, getHeaders());
};

export const createEngineer = (engineer) => {
  return axios.post(API, engineer, getHeaders());
};

export const deleteEngineer = (id) => {
  return axios.delete(`${API}/${id}`, getHeaders());
};