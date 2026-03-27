import PropTypes from "prop-types";

function Spinner({ size = "md" }) {
    const sizeClass =
        size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";

    return (
        <span
            className={`inline-block ${sizeClass} border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin`}
            aria-hidden="true"
        />
    );
}

Spinner.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Spinner;
