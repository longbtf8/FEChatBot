import PropTypes from "prop-types";

const inputBaseClass =
    "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function FormInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    required,
    placeholder,
    ...props
}) {
    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={inputBaseClass}
                {...props}
            />
        </div>
    );
}

FormInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
};

export default FormInput;
