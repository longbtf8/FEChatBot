import PropTypes from "prop-types";

function MessageBubble({ children }) {
    return (
        <li className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800">
            {children}
        </li>
    );
}

MessageBubble.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MessageBubble;
