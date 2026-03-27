import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessageFromApiError } from "@/utils/errors";
import { useRegisterMutation } from "@/store/api/authApi";
import { ROUTES } from "@/config/routes";
import {
    AuthCard,
    AuthFooter,
    ErrorAlert,
    FormInput,
    SubmitButton,
} from "@/components/ui";

function Register() {
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register({ email, password }).unwrap();
            navigate(ROUTES.HOME, {
                state: {
                    message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
                },
            });
        } catch (err) {
            setError(getErrorMessageFromApiError(err));
        }
    };

    return (
        <AuthCard title="Đăng ký" centered={false}>
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

                {error && <ErrorAlert>{error}</ErrorAlert>}

                <SubmitButton loading={isLoading} loadingText="Đang xử lý..." fullWidth>
                    Đăng ký
                </SubmitButton>
            </form>

            <AuthFooter
                text="Đã có tài khoản?"
                linkText="Đăng nhập"
                to={ROUTES.LOGIN}
            />
        </AuthCard>
    );
}

export default Register;
