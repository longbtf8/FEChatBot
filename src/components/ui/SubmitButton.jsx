import PropTypes from "prop-types";

const baseClass =
    "bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors";

function SubmitButton({
    children,
    loading,
    loadingText = "Đang xử lý...",
    fullWidth = false,
    className = "",
    ...props
}) {
    return (
        <button
            type="submit"
            className={`${baseClass} ${fullWidth ? "w-full py-2.5" : "px-4 py-2 self-end"} ${className}`}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
}

SubmitButton.propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default SubmitButton;
