import React from 'react'

export default function InputRadio({ register, name, errors, value, label }) {
    return (
        <label className="flex items-center gap-1 ">
            <input type="radio" value={value} {...register(name, { required: true })} />
            {label}
        </label>
    )
}
