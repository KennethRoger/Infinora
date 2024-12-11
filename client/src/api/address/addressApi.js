import axios from "axios";

export const addAddress = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/address/add`,
      data
    );
    console.log(response);
  } catch (error) {
    console.log("Error while requesting: ", error);
    throw error;
  }
};

