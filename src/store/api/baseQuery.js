import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_URL.replace(/\/$/, ""),
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        headers.set("content-type", "application/json");
        return headers;
    },
});
