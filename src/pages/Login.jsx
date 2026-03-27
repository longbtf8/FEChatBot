import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    getErrorMessageFromApiError,
    ERROR_VERIFY_EMAIL,
    RESEND_SUCCESS_MESSAGE,
} from "@/utils/errors";
import { useLoginMutation, useResendVerificationEmailMutation } from "@/store/api/authApi";
import { apiSlice } from "@/store/api/apiSlice";
import { ROUTES } from "@/config/routes";
import {
    AuthCard,
    AuthFooter,
    ErrorAlert,
    FormInput,
    SubmitButton,
    SuccessAlert,
} from "@/components/ui";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [resendVerificationEmail, { isLoading: isResending }] =
        useResendVerificationEmailMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [resendMessage, setResendMessage] = useState("");

    const isVerifyEmailError = error === ERROR_VERIFY_EMAIL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResendMessage("");

        try {
            const data = await login({ email, password }).unwrap();
            const { access_token, refresh_token } = data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            await dispatch(
                apiSlice.endpoints.getMe.initiate(undefined, { forceRefetch: true })
            ).unwrap();

            const from = location.state?.from || ROUTES.HOME;
            navigate(from, { replace: true });
        } catch (err) {
            setError(getErrorMessageFromApiError(err));
        }
    };

    const handleResendVerification = async () => {
        setResendMessage("");
        try {
            await resendVerificationEmail({ email, password }).unwrap();
            setResendMessage(RESEND_SUCCESS_MESSAGE);
        } catch (err) {
            setResendMessage(
                getErrorMessageFromApiError(err, "Không thể gửi. Vui lòng thử lại.")
            );
        }
    };

    return (
        <AuthCard title="Đăng nhập" centered={false}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                />
                <FormInput
                    id="password"
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <div className="space-y-2">
                        <ErrorAlert>{error}</ErrorAlert>
                        {isVerifyEmailError && (
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
                            >
                                {isResending ? "Đang gửi..." : "Gửi lại email xác minh"}
                            </button>
                        )}
                        {resendMessage &&
                            (resendMessage === RESEND_SUCCESS_MESSAGE ? (
                                <SuccessAlert>{resendMessage}</SuccessAlert>
                            ) : (
                                <ErrorAlert>{resendMessage}</ErrorAlert>
                            ))}
                    </div>
                )}

                <SubmitButton loading={isLoading} loadingText="Đang xử lý..." fullWidth>
                    Đăng nhập
                </SubmitButton>
            </form>

            <AuthFooter
                text="Chưa có tài khoản?"
                linkText="Đăng ký"
                to={ROUTES.REGISTER}
            />
        </AuthCard>
    );
}

export default Login;
