import { configureStore } from "@reduxjs/toolkit";
// import  form "../features/authSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})