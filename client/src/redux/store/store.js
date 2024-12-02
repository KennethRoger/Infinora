import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import categoryReducer from "../features/categorySlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
  },
});

export default store;
