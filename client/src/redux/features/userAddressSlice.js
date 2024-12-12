import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserAddresses = createAsyncThunk(
  "userAddresses/fetchById",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/address/all`,
        { withCredentials: true }
      );
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user addresses"
      );
    }
  }
);

const userAddressSlice = createSlice({
  name: "userAddresses",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUserAddresses: (state) => {
      state.addresses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserAddresses } = userAddressSlice.actions;
export default userAddressSlice.reducer;
