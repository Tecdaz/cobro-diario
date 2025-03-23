"use client"

import InputField from "@/components/InputField";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLayout } from "@/contexts/LayoutContext";
import { getClientData, createVentaData } from "@/lib/db";
import SelectField from "@/components/SelectField";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RenovarVenta() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth()
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            producto: "Credito"
        }
    });

    const [valorVenta, setValorVenta] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);
    const [numeroCuotas, setNumeroCuotas] = useState(0);
    const [valorInteres, setValorInteres] = useState(0);
    const [valorProducto, setValorProducto] = useState(0);
    const [clientData, setClientData] = useState(null);

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
        handleTitleChange("Renovar venta");

        const fetchClientData = async () => {
            try {
                const data = await getClientData(id);
                if (data && data.length > 0) {
                    setClientData(data[0]);
                    // Pre-cargar los datos del cliente en el formulario
                    setValue('nombre', data[0].nombre);
                    setValue('telefono', data[0].telefono);
                    setValue('direccion', data[0].direccion);
                    setValue('documento', data[0].documento);
                }
            } catch (error) {
                console.error("Error al cargar datos del cliente:", error);
            }
        };

        if (id) {
            fetchClientData();
        }
    }, [id, handleTitleChange, setValue]);

    const onSubmit = async (data) => {
        try {
            const ventaData = {
                cliente_id: id,
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

            router.push("/");
        } catch (error) {
            console.error("Error al renovar venta:", error);
        }
    }

    if (!clientData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando datos del cliente...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-2">
            <h2 className="font-semibold text-l">Datos cliente</h2>
            <InputField label="Nombre" register={register} name="nombre" required={true} errors={errors} isDisabled={true} />
            <InputField label="Dirección" register={register} name="direccion" required={true} errors={errors} isDisabled={true} />

            <div className="flex gap-2 justify-between">
                <InputField label="Documento" register={register} name="documento" required={true} errors={errors} className="flex-1" isDisabled={true} />
                <InputField label="Teléfono" register={register} name="telefono" required={true} errors={errors} className="flex-1" isDisabled={true} />
            </div>

            <h2 className="font-semibold text-l mt-2">Datos nueva venta</h2>
            <InputField label="Producto" register={register} name="producto" required={true} errors={errors} />

            <SelectField
                label="Frecuencia"
                register={register}
                name="frecuencia"
                options={[
                    { value: "diario", label: "Diario" },
                    { value: "semanal", label: "Semanal" },
                    { value: "quincenal", label: "Quincenal" },
                    { value: "mensual", label: "Mensual" }
                ]}
                required={true}
                errors={errors}
            />

            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                    <InputField
                        label="Valor producto"
                        register={register}
                        name="valorProducto"
                        required={true}
                        errors={errors}
                        type='number'
                        handleOnChange={handleValorVenta}
                    />
                </div>

                <InputField
                    label="Número de cuotas"
                    register={register}
                    name="numeroCuotas"
                    required={true}
                    errors={errors}
                    handleOnChange={handleValorVenta}
                    type='number'
                />

                <InputField
                    label="Valor cuota"
                    register={register}
                    name="valorCuota"
                    required={true}
                    errors={errors}
                    handleOnChange={handleValorVenta}
                    type='number'
                />

                <div className="col-span-2">
                    <p className={`${valorVenta < valorProducto ? "text-red-500" : ""}`}>
                        <span className="text-black">Valor venta:</span> {valorVenta}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className={`${valorInteres < 0 ? "text-red-500" : ""}`}>
                        <span className="text-black">Interés:</span> {Math.round(valorInteres)} %
                    </p>
                </div>
            </div>

            <button
                className="bg-orange-500 text-white p-2 rounded-md mt-2 hover:bg-orange-600 transition-colors"
                type="submit"
            >
                Renovar venta
            </button>
        </form>
    );
} 