import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import categoryReducer from "../features/categorySlice";
import allProductsReducer from "../features/allProductsSlice";
import vendorProductsReducer from "../features/vendorProductsSlice";
import singleProductReducer from "../features/singleProductSlice";
import userAddressesReducer from "../features/userAddressSlice";
import userCartReducer from "../features/userCartSlice";
import userOrderReducer from "../features/userOrderSlice";
import vendorCouponsReducer from "../features/vendorCouponSlice";
import favoriteReducer from "../features/userFavoriteSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
    allProducts: allProductsReducer,
    vendorProducts: vendorProductsReducer,
    singleProduct: singleProductReducer,
    userAddresses: userAddressesReducer,
    userCart: userCartReducer,
    userOrder: userOrderReducer,
    vendorCoupons: vendorCouponsReducer,
    favorites: favoriteReducer,
  },
});

export default store;
