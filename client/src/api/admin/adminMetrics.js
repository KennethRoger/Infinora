import axios from "axios";

export const getAdminSalesReport = async (
  startDate,
  endDate,
  reportType,
  vendorId = null
) => {
  try {
    const params = { startDate, endDate, reportType };
    if (vendorId) {
      params.vendorId = vendorId;
    }

    const response = await axios.get("/api/metrics/admin/sales-report", {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
