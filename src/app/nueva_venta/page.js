"use client"

import InputField from "@/components/InputField";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useLayout } from "@/contexts/LayoutContext";
import { createClientData, createVentaData } from "@/lib/db";
import { Watch } from "lucide-react";
import SelectField from "@/components/SelectField";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function NuevaVenta() {
    const { handleTitleChange, setRequireConfirmation } = useLayout();
    const { cartera, user } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            producto: "Credito"
        }
    }
    );

    const router = useRouter();
    const [valorVenta, setValorVenta] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);
    const [numeroCuotas, setNumeroCuotas] = useState(0);
    const [valorInteres, setValorInteres] = useState(0);
    const [valorProducto, setValorProducto] = useState(0);

    const handleValorVenta = (e) => {
        const { name, value } = e.target;
        const numericValue = value === "" ? 0 : Number(value);




        if (name === 'numeroCuotas') {
            setNumeroCuotas(numericValue);
            const nuevoValorVenta = numericValue * valorCuota;
            setValorVenta(nuevoValorVenta);
            if (valorProducto > 0) {
                setValorInteres(((nuevoValorVenta / valorProducto) - 1) * 100);
            }
        }
        if (name === 'valorCuota') {
            setValorCuota(numericValue);
            const nuevoValorVenta = numericValue * numeroCuotas;
            setValorVenta(nuevoValorVenta);
            if (valorProducto > 0) {
                setValorInteres(((nuevoValorVenta / valorProducto) - 1) * 100);
            }

        }
        if (name === 'valorProducto' && numericValue > 0) {
            setValorProducto(numericValue);
            setValorInteres(((valorVenta / numericValue) - 1) * 100);
        }
    }

    useEffect(() => {
        setRequireConfirmation(true);
        handleTitleChange("Nueva venta")

        return () => {
            setRequireConfirmation(false);
        };
    }, [handleTitleChange, setRequireConfirmation]);


    const onSubmit = async (data) => {
        try {


            const clienteData = await createClientData({
                documento: data.documento,
                nombre: data.nombre,
                telefono: data.telefono,
                direccion: data.direccion,
                id_cartera: cartera.id_cartera,
                cobrador: user.id
            });


            const idCliente = clienteData[0].id;

            const ventaData = {
                cliente_id: idCliente,
                producto: data.producto,
                precio: data.valorProducto,
                cuotas: data.numeroCuotas,
                valor_cuota: data.valorCuota,
                frecuencia: data.frecuencia,
                activa: true,
                cobrador: user.id,
                id_cartera: cartera.id_cartera
            }

            await createVentaData(ventaData);

            // Redireccionar al inicio
            router.push("/");
        }
        catch (error) {
            console.error("Error al enviar datos", error);
        }
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-2">
            <h2 className="font-semibold text-l">Datos cliente</h2>
            <InputField label="Nombre" register={register} name="nombre" required={true} errors={errors} />

            <InputField label="Direccion" register={register} name="direccion" required={true} errors={errors} />

            <div className="flex gap-2 justify-between">
                <InputField label="Documento" register={register} name="documento" required={true} errors={errors} className="flex-1" />



                <InputField label="Telefono" register={register} name="telefono" required={true} errors={errors} className="flex-1" />
            </div>





            <h2 className="font-semibold text-l mt-2">Datos venta</h2>

            <InputField label="Producto" register={register} name="producto" required={true} errors={errors} />

            <SelectField
                label="Frecuencia"
                register={register}
                name="frecuencia"
                options={
                    [{ value: "diario", label: "Diario" }, { value: "semanal", label: "Semanal" },
                    { value: "quincenal", label: "Quincenal" }, { value: "mensual", label: "Mensual" }]
                }
                required={true}
                errors={errors} />


            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                    <InputField label="Valor producto" register={register} name="valorProducto" required={true} errors={errors} type='number' handleOnChange={handleValorVenta} />
                </div>


                <InputField label="Número de cuotas" register={register} name="numeroCuotas" required={true} errors={errors} handleOnChange={handleValorVenta} type='number' />

                <InputField label="Valor cuota" register={register} name="valorCuota" required={true} errors={errors} handleOnChange={handleValorVenta} type='number' />

                <div className="col-span-2">
                    <p className={`${valorVenta < valorProducto ? "text-red-500" : ""}`}><span className="text-black">Valor venta:</span> {valorVenta}</p>
                </div>
                <div className="col-span-2">
                    <p className={`${valorInteres < 0 ? "text-red-500" : ""}`}><span className="text-black">Interes:</span> {Math.round(valorInteres)} %</p>
                </div>
            </div>

            <button className="bg-blue-500 text-white p-2 rounded-md mt-2" onClick={handleSubmit(onSubmit)}>Registrar venta</button>


        </form>

    );
};




