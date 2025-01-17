import axios from "axios";

export const addToCart = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/add`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while adding to cart: ", error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/get`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching cart: ", error);
    throw error;
  }
};

export const incrementCartItem = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/increment`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while incrementing cart item: ", error);
    throw error;
  }
};

export const decrementCartItem = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/decrement`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while decrementing cart item: ", error);
    throw error;
  }
};

export const removeFromCart = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/remove`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while removing from cart: ", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    console.log("reached")
    const response = await axios.delete(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/clear`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while removing from cart: ", error);
    throw error;
  }
};