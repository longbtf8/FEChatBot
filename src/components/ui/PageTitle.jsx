import PropTypes from "prop-types";

function PageTitle({ children }) {
    return (
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">{children}</h1>
    );
}

PageTitle.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageTitle;
