import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;

export const getSalesReport = async ({
  startDate,
  endDate,
  reportType = "custom",
}) => {
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
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch sales report",
      }
    );
  }
};

export const getProductPerformance = async (timeRange, startDate, endDate) => {
  try {
    const params = { timeRange };
    if (timeRange === 'custom' && startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/metrics/vendor/product-performance`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: "Failed to fetch product performance",
    };
  }
};

export const getSalesAndOrdersMetrics = async (timeRange, startDate, endDate) => {
  try {
    const params = { timeRange };
    if (timeRange === 'custom' && startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/metrics/vendor/sales-and-orders`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: "Failed to fetch sales and orders metrics",
    };
  }
};