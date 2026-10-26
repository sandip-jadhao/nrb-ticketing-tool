import axios from "axios";

const API = "http://localhost:8080/api/admin/reports";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  responseType: "blob",
});

export const downloadTicketReportExcel = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API}/download-excel`, {
      params: { startDate, endDate },
      ...getAuthHeaders(),
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Ticket_Report_${startDate}_to_${endDate}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download report:", error);
    alert("Could not download report. Please try again.");
  }
};