import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVendorProducts = createAsyncThunk(
  "vendorProducts/fetchVendorProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/products/vendor?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return response.data;
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
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      hasMore: false
    }
  },
  reducers: {
    clearVendorProducts: (state) => {
      state.products = [];
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasMore: false
      };
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
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorProducts } = vendorProductsSlice.actions;

export const selectVendorProducts = (state) => state.vendorProducts.products;
export const selectVendorProductsLoading = (state) => state.vendorProducts.loading;
export const selectVendorProductsError = (state) => state.vendorProducts.error;
export const selectVendorProductsPagination = (state) => state.vendorProducts.pagination;

export default vendorProductsSlice.reducer;
