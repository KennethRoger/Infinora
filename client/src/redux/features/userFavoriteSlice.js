import { toggleFavorite, getFavorites } from "@/api/user/userFavorites";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const toggleProductFavorite = createAsyncThunk(
  "favorites/toggle",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await toggleFavorite(productId);
      toast.success(response.message);
      return { productId, isFavorited: response.isFavorited };
    } catch (error) {
      toast.error(error.message || "Failed to update favorite");
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFavorites();
      return response.favorites;
    } catch (error) {
      toast.error(error.message || "Failed to fetch favorites");
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleProductFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleProductFavorite.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isFavorited) {
          if (!state.items.find(item => item.productId._id === action.payload.productId)) {
            state.items.push({ productId: { _id: action.payload.productId } });
          }
        } else {
          state.items = state.items.filter(
            item => item.productId._id !== action.payload.productId
          );
        }
      })
      .addCase(toggleProductFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favoritesSlice.reducer;