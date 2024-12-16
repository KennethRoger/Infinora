import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart } from "@/api/cart/cartApi";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchUserCart = createAsyncThunk(
  "userCart/fetchUserCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

const userCartSlice = createSlice({
  name: "userCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = userCartSlice.actions;
export default userCartSlice.reducer;
