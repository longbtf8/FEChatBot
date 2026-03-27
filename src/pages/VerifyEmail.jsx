import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getErrorMessageFromApiError } from "@/utils/errors";
import { useVerifyEmailMutation } from "@/store/api/authApi";
import { ROUTES } from "@/config/routes";
import { AuthCard, Spinner } from "@/components/ui";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [verifyEmail] = useVerifyEmailMutation();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Thiếu thông tin xác thực.");
            return;
        }

        verifyEmail({ token })
            .unwrap()
            .then((result) => {
                setStatus("success");
                setMessage(typeof result === "string" ? result : result?.message || "Xác thực thành công.");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(getErrorMessageFromApiError(err));
            });
    }, [token, verifyEmail]);

    return (
        <AuthCard title={null} centered>
            {status === "loading" && (
                <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" />
                    <p className="text-slate-600">Đang xác thực...</p>
                </div>
            )}

            {status === "success" && (
                <>
                    <p className="text-emerald-600 font-medium mb-4">
                        Email đã được xác thực. Bạn có thể đăng nhập.
                    </p>
                    <Link
                        to={ROUTES.LOGIN}
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Đăng nhập
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <p className="text-red-600 font-medium mb-4">{message}</p>
                    <Link
                        to={ROUTES.HOME}
                        className="inline-block px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-medium"
                    >
                        Về trang chủ
                    </Link>
                </>
            )}
        </AuthCard>
    );
}

export default VerifyEmail;
