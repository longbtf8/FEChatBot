import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/store/api/apiSlice";
import "@/store/api/authApi";
import "@/store/api/usersApi";
import "@/store/api/conversationsApi";
import authReducer from "@/store/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
