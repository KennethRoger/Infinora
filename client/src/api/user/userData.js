import axios from "axios";

export const fetchUser = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/me`,
      { withCredentials: true }
    );
    console.log("Fetched user:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
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

export const generateOTPForPass = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/generate-otp`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

export const confirmOtp = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/confirm-otp`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to confirm OTP:", error);
    throw error;
  }
};

export const changeToNewPassword = async (data) => {
  try {
    console.log("reached 2")
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/new-password`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create new password:", error);
    throw error;
  }
};
