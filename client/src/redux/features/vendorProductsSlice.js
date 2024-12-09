import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVendorProducts = createAsyncThunk(
  "vendorProducts/fetchVendorProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/products/vendor`,
        { withCredentials: true }
      );
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor products"
      );
    }
  }
);

const vendorProductsSlice = createSlice({
  name: "vendorProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVendorProducts: (state) => {
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorProducts } = vendorProductsSlice.actions;
export default vendorProductsSlice.reducer;
