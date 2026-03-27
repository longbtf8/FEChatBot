import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "@/store/api/apiSlice";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isChecked: false,
        isLoading: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        },
        setChecked: (state) => {
            state.isChecked = true;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(apiSlice.endpoints.getMe.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(apiSlice.endpoints.getMe.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.isChecked = true;
            })
            .addMatcher(apiSlice.endpoints.getMe.matchRejected, (state) => {
                state.user = null;
                state.isLoading = false;
                state.isChecked = true;
            });
    },
});

export const { setUser, clearUser, setChecked } = authSlice.actions;
export default authSlice.reducer;
