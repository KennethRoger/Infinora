import axios from "axios";

export const findAddressById = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/address/`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error while requesting address: ", error);
    throw error;
  }
};

export const addAddress = async (data) => {
  try {
    console.log("Add address data: ", data);
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/address/add`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error while requestin to edit address: ", error);
    throw error;
  }
};

export const editAddress = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/address/edit`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error while requesting: ", error);
    throw error;
  }
};

export const deleteAddress = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/address/delete`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error while deleting address: ", error);
    throw error;
  }
};
