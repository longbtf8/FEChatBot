import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/store/api/baseQuery";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    endpoints: () => ({}),
});
