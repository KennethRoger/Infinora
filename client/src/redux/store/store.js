import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import categoryReducer from "../features/categorySlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer
  },
});

export default store;
