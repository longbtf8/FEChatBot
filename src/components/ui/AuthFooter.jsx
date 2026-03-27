import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function AuthFooter({ text, linkText, to }) {
    return (
        <p className="mt-4 text-center text-sm text-slate-600">
            {text}{" "}
            <Link to={to} className="text-blue-600 hover:underline font-medium">
                {linkText}
            </Link>
        </p>
    );
}

AuthFooter.propTypes = {
    text: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default AuthFooter;
