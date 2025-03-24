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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NuevaVenta() {
    const { handleTitleChange, setRequireConfirmation } = useLayout();
    const { cartera, user } = useAuth();

    // Obtener el día de la semana actual (0 = domingo, 1 = lunes, ..., 6 = sábado)
    const fechaActual = new Date();
    const diaSemana = fechaActual.getDay();
    // Convertir al formato 1-7 donde 1 es lunes y 7 es domingo
    const diaSemanaAjustado = diaSemana === 0 ? "7" : String(diaSemana);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            producto: "Credito",
            diaSemana: diaSemanaAjustado
        }
    });

    const router = useRouter();
    const [valorVenta, setValorVenta] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);
    const [numeroCuotas, setNumeroCuotas] = useState(0);
    const [valorInteres, setValorInteres] = useState(0);
    const [valorProducto, setValorProducto] = useState(0);
    const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState("");
    const [fechaMinima, setFechaMinima] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

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

    const handleFrecuenciaChange = (e) => {
        setFrecuenciaSeleccionada(e.target.value);
        console.log(e.target.value);
    }

    useEffect(() => {
        setRequireConfirmation(true);
        handleTitleChange("Nueva venta")

        return () => {
            setRequireConfirmation(false);
        };
    }, [handleTitleChange, setRequireConfirmation]);

    useEffect(() => {
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        setFechaMinima(`${año}-${mes}-${dia}`);
    }, []);

    const validarFechaCobro = (value) => {
        if (!value) return "Este campo es requerido";

        const fechaSeleccionada = new Date(value);
        const fechaActual = new Date();

        // Reiniciamos las horas para comparar solo fechas
        fechaSeleccionada.setHours(0, 0, 0, 0);
        fechaActual.setHours(0, 0, 0, 0);

        if (fechaSeleccionada <= fechaActual) {
            return "La fecha debe ser posterior a la fecha actual";
        }

        return true;
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError(null);
        setMensaje("Registrando venta...");

        try {
            // Registrar el cliente
            setMensaje("Registrando datos del cliente...");
            const clienteData = await createClientData({
                documento: data.documento,
                nombre: data.nombre,
                telefono: data.telefono,
                direccion: data.direccion,
                id_cartera: cartera.id_cartera,
                cobrador: user.id
            });

            const idCliente = clienteData[0].id;

            // Registrar la venta
            setMensaje("Registrando datos de la venta...");
            const ventaData = {
                cliente_id: idCliente,
                producto: data.producto,
                precio: data.valorProducto,
                cuotas: data.numeroCuotas,
                valor_cuota: data.valorCuota,
                frecuencia: data.frecuencia,
                fecha_cobro: (data.frecuencia === "mensual" || data.frecuencia === "quincenal") ? data.fechaCobro : null,
                dia_semana: data.frecuencia === "semanal" ? parseInt(data.diaSemana) : null,
                activa: true,
                cobrador: user.id,
                id_cartera: cartera.id_cartera
            }

            await createVentaData(ventaData);

            setMensaje("¡Venta registrada correctamente! Redirigiendo...");

            // Esperar un segundo antes de redireccionar para que el usuario vea el mensaje de éxito
            setTimeout(() => {
                // Redireccionar al inicio
                router.push("/");
            }, 1000);
        }
        catch (error) {
            console.error("Error al enviar datos", error);
            setError("Error al registrar la venta: " + (error.message || "Por favor intente nuevamente"));
            setMensaje(null);
            setIsSubmitting(false);
        }
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-2">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {mensaje && !error && (
                <Alert className="mb-4">
                    <AlertDescription>{mensaje}</AlertDescription>
                </Alert>
            )}

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
                errors={errors}
                handleOnChange={handleFrecuenciaChange} />

            {(frecuenciaSeleccionada === "mensual" || frecuenciaSeleccionada === "quincenal") && (
                <InputField
                    label={`Fecha de cobro ${frecuenciaSeleccionada}`}
                    register={register}
                    name="fechaCobro"
                    type="date"
                    required={frecuenciaSeleccionada === "mensual" || frecuenciaSeleccionada === "quincenal"}
                    errors={errors}
                    min={fechaMinima}
                    validate={validarFechaCobro}
                />
            )}

            {frecuenciaSeleccionada === "semanal" && (
                <SelectField
                    label="Día de cobro semanal"
                    register={register}
                    name="diaSemana"
                    options={[
                        { value: "1", label: "Lunes" },
                        { value: "2", label: "Martes" },
                        { value: "3", label: "Miércoles" },
                        { value: "4", label: "Jueves" },
                        { value: "5", label: "Viernes" },
                        { value: "6", label: "Sábado" },
                        { value: "7", label: "Domingo" }
                    ]}
                    required={frecuenciaSeleccionada === "semanal"}
                    errors={errors}
                />
            )}

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

            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md mt-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Procesando...' : 'Registrar venta'}
            </button>


        </form>

    );
};




