import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import categoryReducer from "../features/categorySlice";
import allProductsReducer from "../features/allProductsSlice";
import vendorProductsReducer from "../features/vendorProductsSlice";
import singleProductReducer from "../features/singleProductSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
    allProducts: allProductsReducer,
    vendorProducts: vendorProductsReducer,
    singleProduct: singleProductReducer,
  },
});

export default store;
