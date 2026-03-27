import PropTypes from "prop-types";

function AuthCard({ title, children, centered = true }) {
    return (
        <div className="max-w-sm mx-auto p-6">
            <div
                className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${centered ? "text-center" : ""}`}
            >
                {title && (
                    <h1 className="text-xl font-semibold text-slate-800 text-center mb-6">
                        {title}
                    </h1>
                )}
                {children}
            </div>
        </div>
    );
}

AuthCard.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    centered: PropTypes.bool,
};

export default AuthCard;
