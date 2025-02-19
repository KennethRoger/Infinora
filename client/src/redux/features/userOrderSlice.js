import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserOrders } from "@/api/order/orderApi";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasMore: false
  },
  checkout: {
    selectedAddressId: null,
    selectedPaymentMethod: null,
  },
};

export const fetchUserOrders = createAsyncThunk(
  "userOrder/fetchUserOrders",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getUserOrders(page, limit);
      return response;
    } catch (error) {
      console.error("Error in fetchUserOrders:", error);
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
      state.pagination = initialState.pagination;
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
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
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

export const selectUserOrders = (state) => state.userOrder.orders;
export const selectUserOrdersLoading = (state) => state.userOrder.loading;
export const selectUserOrdersError = (state) => state.userOrder.error;
export const selectCheckout = (state) => state.userOrder.checkout;
export const selectUserOrdersPagination = (state) => state.userOrder.pagination;

export default userOrderSlice.reducer;
