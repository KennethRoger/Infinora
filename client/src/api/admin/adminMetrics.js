import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;

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

export const getAdminRevenueMetrics = async (timeRange, startDate, endDate) => {
  try {
    const params = { timeRange };
    if (timeRange === 'custom' && startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/metrics/admin/revenue`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: "Failed to fetch admin revenue metrics",
    };
  }
};

export const getUserActivityMetrics = async (timeRange, startDate, endDate) => {
  try {
    const params = { timeRange };
    if (timeRange === 'custom' && startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/metrics/admin/user-activity`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: "Failed to fetch user activity metrics",
    };
  }
};
