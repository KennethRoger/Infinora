import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVendors = createAsyncThunk(
  "users/fetchVendors",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_USERS_API_BASE_URL
        }/api/user/vendors?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      console.log("Data response from redux: ", response);
      return response.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch vendors");
    }
  }
);

const vendorSlice = createSlice({
  name: "vendors",
  initialState: {
    vendors: [],
    verifiedUsers: [],
    status: "idle",
    loading: "false",
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalVendors: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.vendors = action.payload.data.vendors;
        state.verifiedUsers = action.payload.data.verifiedUsers;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vendorSlice.reducer;
