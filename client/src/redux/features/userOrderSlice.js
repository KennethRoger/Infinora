import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserOrders } from "@/api/order/orderApi";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  checkout: {
    selectedAddressId: null,
    selectedPaymentMethod: null,
  },
};

// Fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "userOrder/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.error = null;
    },
    setSelectedAddress(state, action) {
      state.checkout.selectedAddressId = action.payload;
    },
    setSelectedPayment(state, action) {
      state.checkout.selectedPaymentMethod = action.payload;
    },
    clearCheckout(state) {
      state.checkout.selectedAddressId = null;
      state.checkout.selectedPaymentMethod = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrders,
  setSelectedAddress,
  setSelectedPayment,
  clearCheckout,
} = userOrderSlice.actions;
export default userOrderSlice.reducer;
