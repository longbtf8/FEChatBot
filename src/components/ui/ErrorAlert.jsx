import PropTypes from "prop-types";

function ErrorAlert({ children, className = "" }) {
    return (
        <p
            className={`text-sm text-red-600 bg-red-50 p-2 rounded-lg ${className}`}
            role="alert"
        >
            {children}
        </p>
    );
}

ErrorAlert.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default ErrorAlert;
