import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;



export const getStorePerformance = async (timeRange) => {
  try {
    console.log("Reached to getStorePerformance");
    const response = await axios.get(
      `${API_BASE_URL}/api/metrics/vendor/store-performance`,
      {
        params: { timeRange },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch store performance metrics",
      }
    );
  }
};

export const getFinancialAnalytics = async (timeRange) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/metrics/vendor/financial-analytics`,
      {
        params: { timeRange },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch financial analytics",
      }
    );
  }
};

export const getSalesReport = async ({ startDate, endDate, reportType = 'custom' }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/metrics/vendor/sales-report`,
        {
          params: { startDate, endDate, reportType },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: "Failed to fetch sales report",
      };
    }
  };