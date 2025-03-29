export default function SelectField({ label, name, options, register, required, errors, value, handleOnChange, isDisabled }) {
    return (
        <div className="flex flex-col gap-1 text-base w-full">
            <label className="text-sm">{label}</label>
            <div className="relative w-full">
                <select
                    className="p-1 rounded-md border-2 w-full appearance-none"
                    {...register(name, { required })}
                    value={value}
                    disabled={isDisabled}
                    onChange={handleOnChange}
                    style={{
                        maxHeight: '40px',
                        overflow: 'hidden'
                    }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                </div>
            </div>
            {errors[name] && <span className="text-red-600">Este campo es requerido</span>}
        </div>
    );
};
