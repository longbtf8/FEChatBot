import PropTypes from "prop-types";

function SuccessAlert({ children, className = "" }) {
    return (
        <p
            className={`text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg ${className}`}
            role="status"
        >
            {children}
        </p>
    );
}

SuccessAlert.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default SuccessAlert;
