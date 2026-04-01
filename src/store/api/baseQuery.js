import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const API_URL =
  import.meta.env.VITE_API_URL || "https://bechatbot.onrender.com/";

const baseQuery = fetchBaseQuery({
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

// Base query riêng không có auth header dùng cho refresh token
const refreshBaseQuery = fetchBaseQuery({
  baseUrl: API_URL.replace(/\/$/, ""),
  prepareHeaders: (headers) => {
    headers.set("content-type", "application/json");
    return headers;
  },
});

// Biến dùng chung để quản lý việc refresh token duy nhất một lần tại một thời điểm
let refreshPromise = null;

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Nếu đang có một request khác thực hiện refresh, đợi nó xong
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      // Nếu chưa có ai đang thực hiện refresh, hãy bắt đầu
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshResult = await refreshBaseQuery(
              {
                url: "auth/refresh-token",
                method: "POST",
                body: { refresh_token: refreshToken },
              },
              api,
              extraOptions,
            );

            if (refreshResult.data && refreshResult.data.success) {
              const { access_token, refresh_token } = refreshResult.data.data;
              localStorage.setItem("access_token", access_token);
              localStorage.setItem("refresh_token", refresh_token);
              return true;
            } else {
              api.dispatch({ type: "auth/clearUser" });
              return false;
            }
          } catch (error) {
            api.dispatch({ type: "auth/clearUser" });
            return false;
          } finally {
            // Quan trọng: Giải phóng khóa sau khi hoàn tất
            refreshPromise = null;
          }
        })();
      }

      const success = await refreshPromise;

      if (success) {
        // Thử lại request ban đầu với token mới đã được lưu
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      api.dispatch({ type: "auth/clearUser" });
    }
  }

  return result;
};
