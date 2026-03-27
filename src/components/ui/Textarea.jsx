import PropTypes from "prop-types";

const textareaBaseClass =
    "px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none";

function Textarea({ className = "", ...props }) {
    return (
        <textarea
            className={`${textareaBaseClass} ${className}`}
            {...props}
        />
    );
}

Textarea.propTypes = {
    className: PropTypes.string,
};

export default Textarea;
