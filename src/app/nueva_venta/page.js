"use client"

import InputField from "@/components/InputField";
import { useForm } from "react-hook-form";

export default function NuevaVenta() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            producto: "Credito"
        }
    }
    );


    const onSubmit = (data) => {
        console.log("Datos enviados:", data);
    };

    return (

        <form className="flex flex-col p-4 gap-2">
            <h2 className="font-semibold text-l">Datos cliente</h2>

            <InputField label="Documento" register={register} name="documento" required={true} errors={errors} />
            <InputField label="Nombre" register={register} name="nombre" required={true} errors={errors} />

            <div className="flex gap-2">
                <InputField label="Area movil" register={register} name="areaMovil" required={true} errors={errors} />
                <InputField label="Numero" register={register} name="numero" required={true} errors={errors} />
            </div>

            <InputField label="Direccion" register={register} name="direccion" required={true} errors={errors} />

            <h2 className="font-semibold text-l mt-2">Datos venta</h2>

            <InputField label="Producto" register={register} name="producto" required={true} errors={errors} />

            <div className="grid grid-cols-2 gap-2">
                <InputField label="Valor producto" register={register} name="valorProducto" required={true} errors={errors} />

                <InputField label="Número de cuotas" register={register} name="numeroCuotas" required={true} errors={errors} />

                <InputField label="Interés" register={register} name="interes" required={true} errors={errors} />

                <InputField label="Valor cuota" register={register} name="valorCuota" required={true} errors={errors} />
            </div>

            <button className="bg-blue-500 text-white p-2 rounded-md mt-2" onClick={handleSubmit(onSubmit)}>Registrar venta</button>


        </form>

    );
}

