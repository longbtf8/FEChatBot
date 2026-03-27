const AUTH_ERROR_CODES = {
    UNAUTHORIZED: "UNAUTHORIZED",
    NOT_FOUND: "NOT_FOUND",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
    EMAIL_ALREADY_VERIFIED: "EMAIL_ALREADY_VERIFIED",
    INVALID_TOKEN: "INVALID_TOKEN",
    CONFLICT: "CONFLICT",
    SERVER_ERROR: "SERVER_ERROR",
    PASSWORD_SAME: "PASSWORD_SAME",
    PASSWORD_WRONG: "PASSWORD_WRONG",
};

const AUTH_ERROR_MESSAGES = {
    [AUTH_ERROR_CODES.UNAUTHORIZED]: "Thông tin đăng nhập không hợp lệ.",
    [AUTH_ERROR_CODES.NOT_FOUND]: "Thông tin không hợp lệ.",
    [AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: "Vui lòng xác thực email trước khi đăng nhập.",
    [AUTH_ERROR_CODES.EMAIL_ALREADY_VERIFIED]: "Email đã được xác thực.",
    [AUTH_ERROR_CODES.INVALID_TOKEN]: "Link không hợp lệ hoặc đã hết hạn.",
    [AUTH_ERROR_CODES.CONFLICT]: "Email đã được sử dụng.",
    [AUTH_ERROR_CODES.SERVER_ERROR]: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    [AUTH_ERROR_CODES.PASSWORD_SAME]: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    [AUTH_ERROR_CODES.PASSWORD_WRONG]: "Mật khẩu hiện tại không đúng.",
};

const DEFAULT_MESSAGE = "Đã xảy ra lỗi. Vui lòng thử lại.";
const NETWORK_ERROR_MESSAGE = "Không thể kết nối. Vui lòng thử lại.";

export const ERROR_VERIFY_EMAIL = AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED];

export const RESEND_SUCCESS_MESSAGE = "Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.";

export function getAuthErrorMessage(code) {
    return AUTH_ERROR_MESSAGES[code] ?? DEFAULT_MESSAGE;
}

export function getErrorMessageFromApiError(err, fallback = NETWORK_ERROR_MESSAGE) {
    const code = err?.data?.message ?? err?.message;
    return code ? getAuthErrorMessage(code) : fallback;
}

export function getApiErrorMessage(err, fallback = NETWORK_ERROR_MESSAGE) {
    const code = err?.data?.message ?? err?.message;
    if (!code) return fallback;
    return AUTH_ERROR_MESSAGES[code] ?? code;
}
