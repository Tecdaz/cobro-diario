
export default function InputField({ label, register, name, required, errors, isDisabled, value, handleOnChange, type, className }) {
    return (
        <div className={`flex flex-col gap-1 text-base min-w-0 ${className ? className : ""}`}>
            <label className="text-sm">{label}</label>
            <input
                className="p-1 rounded-md border-2 min-w-0" {...register(name, { required: required })} value={value}
                disabled={isDisabled}
                onChange={handleOnChange && ((e) => handleOnChange(e))}
                type={type ? type : "text"} />
            {errors[name] && <span className="text-red-600">Este campo es requerido</span>}
        </div>
    )
}
