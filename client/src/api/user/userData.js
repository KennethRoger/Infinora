import axios from "axios";

// Uncanny edti user API. Because I am dumb

export const fetchUser = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/me`,
      { withCredentials: true }
    );
    console.log("Logout successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

export const recieveOTPForUpdate = async (data) => {
  const sendData = {
    name: data.name || "",
    email: data.email,
    phoneNumber: data.phoneNumber,
    isUpdate: true,
  };
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/register`,
      sendData,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/update-profile`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};
