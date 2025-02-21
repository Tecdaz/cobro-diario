"use client"

import InputField from "@/components/InputField";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLayout } from "@/contexts/LayoutContext";
import { createClientData, createVentaData } from "@/lib/db";

export default function NuevaVenta() {
    const { handleTitleChange } = useLayout();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            producto: "Credito"
        }
    }
    );

    useEffect(() => {
        handleTitleChange("Nueva venta")
    }, []);


    const onSubmit = async (data) => {
        try {
            console.log("Datos enviados:", data);

            const clienteData = await createClientData({
                documento: data.documento,
                nombre: data.nombre,
                telefono: data.telefono,
                direccion: data.direccion,
            });

            console.log("Cliente creado:", clienteData);
            const idCliente = clienteData[0].id;

            const ventaData = {
                cliente_id: idCliente,
                producto: data.producto,
                precio: data.valorProducto,
                cuotas: data.numeroCuotas,
                valor_cuota: data.valorCuota,
                frecuencia: "semanal",
                dia_semana: "lunes",
                activa: true,
            }

            await createVentaData(ventaData);
            console.log("Venta creada:", ventaData);
        }
        catch (error) {
            console.error("Error al enviar datos", error);
        }
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-2">
            <h2 className="font-semibold text-l">Datos cliente</h2>

            <InputField label="Documento" register={register} name="documento" required={true} errors={errors} />
            <InputField label="Nombre" register={register} name="nombre" required={true} errors={errors} />


            <InputField label="Telefono" register={register} name="telefono" required={true} errors={errors} />


            <InputField label="Direccion" register={register} name="direccion" required={true} errors={errors} />

            <h2 className="font-semibold text-l mt-2">Datos venta</h2>

            <InputField label="Producto" register={register} name="producto" required={true} errors={errors} />

            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                    <InputField label="Valor producto" register={register} name="valorProducto" required={true} errors={errors} />
                </div>


                <InputField label="Número de cuotas" register={register} name="numeroCuotas" required={true} errors={errors} />

                <InputField label="Valor cuota" register={register} name="valorCuota" required={true} errors={errors} />
            </div>

            <button className="bg-blue-500 text-white p-2 rounded-md mt-2" onClick={handleSubmit(onSubmit)}>Registrar venta</button>


        </form>

    );
};




