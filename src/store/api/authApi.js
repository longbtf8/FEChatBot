import { apiSlice } from "@/store/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({ url: "auth/login", method: "POST", body }),
            transformResponse: (response) => response?.data ?? response,
        }),
        register: builder.mutation({
            query: (body) => ({ url: "auth/register", method: "POST", body }),
            transformResponse: (response) => response?.data ?? response,
        }),
        getMe: builder.query({
            query: () => "auth/me",
            transformResponse: (response) => response?.data ?? response,
        }),
        verifyEmail: builder.mutation({
            query: (body) => ({
                url: "auth/verify-email",
                method: "POST",
                body,
            }),
            transformResponse: (response) => response?.data ?? response?.message ?? response,
        }),
        resendVerificationEmail: builder.mutation({
            query: (body) => ({
                url: "auth/resend-verification-email",
                method: "POST",
                body,
            }),
            transformResponse: (response) => response?.data ?? response?.message ?? response,
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLazyGetMeQuery,
    useVerifyEmailMutation,
    useResendVerificationEmailMutation,
} = authApi;
