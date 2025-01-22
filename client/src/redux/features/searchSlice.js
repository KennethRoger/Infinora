import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;

export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/search/products`, {
        params: { query: searchTerm },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "search/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSearchSuggestions = createAsyncThunk(
  "search/getSuggestions",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/search/suggestions`,
        {
          params: { query: searchTerm },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    results: [],
    suggestions: {
      products: [],
      categories: [],
    },
    loading: false,
    error: null,
    recentSearches: JSON.parse(localStorage.getItem("recentSearches") || "[]"),
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addRecentSearch: (state, action) => {
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches = [
          action.payload,
          ...state.recentSearches.slice(0, 2),
        ];
        localStorage.setItem(
          "recentSearches",
          JSON.stringify(state.recentSearches)
        );
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem("recentSearches");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSearchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(getSearchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchTerm = "";
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, addRecentSearch, clearRecentSearches } =
  searchSlice.actions;
export default searchSlice.reducer;
