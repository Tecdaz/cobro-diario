export default function SelectField({ label, name, options, register, required, errors, value, handleOnChange, isDisabled }) {
    return (
        <div className="flex flex-col gap-1 text-base min-w-0">
            <label className="text-sm">{label}</label>
            <select
                className="p-1 rounded-md border-2 min-w-0"
                {...register(name, { required })}
                value={value}
                disabled={isDisabled}
                onChange={handleOnChange}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && <span className="text-red-600">Este campo es requerido</span>}
        </div>
    );
};
