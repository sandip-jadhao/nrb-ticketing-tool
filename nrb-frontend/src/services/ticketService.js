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

export const viewAttachment = async (fileName) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/api/tickets/attachments/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const contentType = response.headers["content-type"] || "application/octet-stream";
    const fileBlob = new Blob([response.data], { type: contentType });
    const fileUrl = window.URL.createObjectURL(fileBlob);
    window.open(fileUrl, "_blank");
  } catch (error) {
    console.error("Error opening attachment:", error);
    alert("Could not open attachment.");
  }
};

export const downloadAttachment = async (fileName) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/api/tickets/attachments/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const contentType = response.headers["content-type"] || "application/octet-stream";
    const fileBlob = new Blob([response.data], { type: contentType });
    const fileUrl = window.URL.createObjectURL(fileBlob);

    const cleanFileName = fileName.includes("_")
      ? fileName.substring(fileName.indexOf("_") + 1)
      : fileName;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", cleanFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileUrl);
  } catch (error) {
    console.error("Error downloading attachment:", error);
    alert("Could not download attachment.");
  }
};