import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "@/config/routes";

function PrivateRoute({ children }) {
    const { user, isChecked, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isChecked || isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="inline-block w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                    Đang tải...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                state={{ from: location.pathname + location.search }}
                replace
            />
        );
    }

    return children;
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
