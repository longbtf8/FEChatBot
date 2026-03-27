import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";
import { ROUTES } from "@/config/routes";

function Layout() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
                <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link
                        to={ROUTES.HOME}
                        className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                    >
                        Demo Chat
                    </Link>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    to={ROUTES.HOME}
                                    className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                                        location.pathname === ROUTES.HOME
                                            ? "bg-slate-100 text-slate-800 font-medium"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Trang chủ
                                </Link>
                                <span className="text-sm text-slate-500 max-w-[140px] truncate">
                                    {user.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-sm px-3 py-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={ROUTES.LOGIN}
                                    className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                                        location.pathname === ROUTES.LOGIN
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
