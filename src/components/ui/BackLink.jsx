import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function BackLink({ to, children = "← Quay lại danh sách" }) {
    return (
        <Link
            to={to}
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
        >
            {children}
        </Link>
    );
}

BackLink.propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    children: PropTypes.node,
};

export default BackLink;
