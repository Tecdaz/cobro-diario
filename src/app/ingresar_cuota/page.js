"use client"
import InputField from "@/components/InputField";
import InputRadio from "@/components/InputRadio";
import { Watch } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLayout } from "@/contexts/LayoutContext";

export default function IngresarCuota() {
    const { handleTitleChange } = useLayout();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            pago: "cuota"
        }
    }
    );

    useEffect(() => {
        handleTitleChange("Ingresar cuota")
    }, [])

    const onSubmit = (data) => {
        console.log("Datos enviados:", data);
    }

    const pagoSeleccionado = watch("pago");
    return (
        <div className="flex flex-col gap-2 p-4 min-h-full h-fit justify-between">
            <h2>Pepito perez</h2>
            <p>Valor cuota: </p>
            <p>Cuotas pagadas: </p>
            <p>Cuotas pendientes: </p>
            <p>Cuotas atrasadas: </p>

            <p>Telefono: </p>
            <p>Direccion: </p>

            <hr />
            <form className="flex flex-col gap-2 flex-1 justify-between" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-1">
                    <InputRadio register={register} label="Cuota" name="pago" value="cuota" />
                    <InputRadio register={register} label="Abono" name="pago" value="abono" />
                    <InputRadio register={register} label="No pago" name="pago" value="no pago" />
                    <InputRadio register={register} label="Siguiente dia" name="pago" value="siguiente dia" />
                </div>
                <InputField label="Producto" register={register} name="producto" required={true} errors={errors} isDisabled={true} value="Credito" />
                <div>
                    <InputField label="Total venta" register={register} name="totalVenta" required={true} errors={errors} isDisabled={true} value={100000} />
                    <InputField label="Saldo actual" register={register} name="saldoActual" required={true} errors={errors} isDisabled={true} value={54000} />
                </div>

                {pagoSeleccionado !== 'no pago' && pagoSeleccionado !== 'siguiente dia' && (
                    <>
                        {pagoSeleccionado === 'cuota' ?
                            (<InputField label="Numero de cuotas" name="cuotas" register={register} required={true} errors={errors} />)
                            :
                            (<InputField label="Valor abono" name="abono" register={register} required={true} errors={errors} />)}
                        < InputField label="Nuevo saldo" register={register} name="nuevoSaldo" required={true} errors={errors} isDisabled={true} value={54000} />
                        <InputField label="Metodo de pago" register={register} name="metodoPago" required={true} errors={errors} />
                    </>


                )}


                <div className="flex-1 flex flex-col  justify-end">
                    <div className="flex gap-4 items-center">
                        <button className="border-gray-500 border-2 p-2 rounded-md mt-2 w-full">Cancelar</button>
                        <button className="bg-blue-500 text-white p-2 rounded-md mt-2 w-full" onClick={handleSubmit(onSubmit)}>Registrar cuota</button>
                    </div>

                </div>

            </form>
        </div>
    )
}
