import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";
import { ROUTES } from "@/config/routes";
import Sidebar from "@/components/Sidebar";

// Các route không hiển thị sidebar
const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.VERIFY_EMAIL];

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => dispatch(clearUser());

  const showSidebar = !!user && !AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="shrink-0 h-14 bg-white border-b border-slate-200 shadow-sm z-40">
        <nav className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Hamburger: chỉ hiện mobile khi có sidebar */}
            {showSidebar && (
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Mở menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <Link
              to={ROUTES.HOME}
              className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
            >
              Demo Chat
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-slate-500 max-w-[160px] truncate">
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

      {/* Body */}
      {showSidebar ? (
        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      )}
    </div>
  );
}

export default Layout;
