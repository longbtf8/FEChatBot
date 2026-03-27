import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const baseQueryWithReauth = fetchBaseQuery({
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
const cleanBaseUrl = API_URL.replace(/\/$/, "");
const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl: cleanBaseUrl,
  prepareHeaders: (headers) => {
    headers.set("content-type", "application/json");
    return headers;
  },
});
export const baseQuery = async (args, api, extraOptions) => {
  let result = await baseQueryWithReauth(args, api, extraOptions);
  // Kiểm tra nếu lỗi 401
  if (result.error && result.error.status === 401) {
    // Gọi API để refresh token (cần một baseQuery không có auth header)
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("Refresh token:", localStorage.getItem("refresh_token"));

    if (refreshToken) {
      const refreshResult = await baseQueryWithoutAuth(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions,
      );
      console.log(refreshResult);
    }

    // // if (refreshResult.data) {
    // //   // Lưu token mới
    // //   api.dispatch(setCredentials(refreshResult.data));
    // //   // Thử lại request gốc
    // //   result = await baseQuery(args, api, extraOptions);
    // // } else {
    // //   // Refresh token thất bại -> đăng xuất
    // //   api.dispatch(logOut());
    // // }
    // console.log(refreshResult);
  }
  return result;
};
