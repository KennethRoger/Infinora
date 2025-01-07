import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVendorCoupons } from "@/api/coupon/couponApi";

export const fetchVendorCoupons = createAsyncThunk(
  "vendorCoupons/fetchVendorCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVendorCoupons();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor coupons"
      );
    }
  }
);

const vendorCouponSlice = createSlice({
  name: "vendorCoupons",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVendorCoupons: (state) => {
      state.coupons = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
        state.error = null;
      })
      .addCase(fetchVendorCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorCoupons } = vendorCouponSlice.actions;
export default vendorCouponSlice.reducer;