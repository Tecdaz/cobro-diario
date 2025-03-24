"use client"

import InputField from "@/components/InputField";
import { useEffect, useState, useCallback } from "react";
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

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            producto: "Credito",
            diaSemana: diaSemanaAjustado,
            valorProducto: 0,
            valorCuota: 0,
            numeroCuotas: 0
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

    // Estados para valores formateados
    const [valorProductoFormateado, setValorProductoFormateado] = useState('');
    const [valorCuotaFormateado, setValorCuotaFormateado] = useState('');
    const [valorVentaFormateado, setValorVentaFormateado] = useState('');

    // Función para formatear moneda (memoizada)
    const formatMoneda = useCallback((valor) => {
        if (valor === undefined || valor === null) return '';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    }, []);

    // Actualiza los formatos de moneda cuando cambian los valores
    useEffect(() => {
        setValorVentaFormateado(formatMoneda(valorVenta));
        setValorProductoFormateado(formatMoneda(valorProducto));
        setValorCuotaFormateado(formatMoneda(valorCuota));
    }, [valorVenta, valorProducto, valorCuota, formatMoneda]);

    // Manejador para el campo de valor producto
    const handleValorProductoChange = useCallback((e) => {
        const valorInput = e.target.value || '';
        const valorNumerico = valorInput.toString().replace(/[^\d]/g, '');

        if (valorNumerico === '') {
            setValorProducto(0);
            setValorProductoFormateado('');
            setValue('valorProducto', 0);
        } else {
            const numero = parseInt(valorNumerico, 10);
            setValorProducto(numero);
            setValue('valorProducto', numero);
            setValorProductoFormateado(formatMoneda(numero));

            // Calcula el interés si hay un valor de venta
            if (valorVenta > 0 && numero > 0) {
                setValorInteres(((valorVenta / numero) - 1) * 100);
            }
        }
    }, [setValue, valorVenta, formatMoneda]);

    // Manejador para el campo de valor cuota
    const handleValorCuotaChange = useCallback((e) => {
        const valorInput = e.target.value || '';
        const valorNumerico = valorInput.toString().replace(/[^\d]/g, '');

        if (valorNumerico === '') {
            setValorCuota(0);
            setValorCuotaFormateado('');
            setValue('valorCuota', 0);
        } else {
            const numero = parseInt(valorNumerico, 10);
            setValorCuota(numero);
            setValue('valorCuota', numero);
            setValorCuotaFormateado(formatMoneda(numero));

            // Calcular nuevo valor de venta
            const nuevoValorVenta = numero * numeroCuotas;
            setValorVenta(nuevoValorVenta);

            // Calcular nuevo interés
            if (valorProducto > 0) {
                setValorInteres(((nuevoValorVenta / valorProducto) - 1) * 100);
            }
        }
    }, [setValue, numeroCuotas, valorProducto, formatMoneda]);

    // Manejador para el campo de número de cuotas
    const handleNumeroCuotasChange = useCallback((e) => {
        const numCuotas = e.target.value ? parseInt(e.target.value) : 0;
        setNumeroCuotas(numCuotas);
        setValue('numeroCuotas', numCuotas);

        // Calcular nuevo valor de venta
        const nuevoValorVenta = numCuotas * valorCuota;
        setValorVenta(nuevoValorVenta);

        // Calcular nuevo interés
        if (valorProducto > 0) {
            setValorInteres(((nuevoValorVenta / valorProducto) - 1) * 100);
        }
    }, [setValue, valorCuota, valorProducto]);

    const handleFrecuenciaChange = (e) => {
        setFrecuenciaSeleccionada(e.target.value);
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
            // Preparar los datos asegurándose que los valores numéricos sean números
            const dataParsed = {
                ...data,
                valorProducto: parseInt(data.valorProducto || 0),
                valorCuota: parseInt(data.valorCuota || 0),
                numeroCuotas: parseInt(data.numeroCuotas || 0)
            };

            // Registrar el cliente
            setMensaje("Registrando datos del cliente...");
            const clienteData = await createClientData({
                documento: dataParsed.documento,
                nombre: dataParsed.nombre,
                telefono: dataParsed.telefono,
                direccion: dataParsed.direccion,
                id_cartera: cartera.id_cartera,
                cobrador: user.id
            });

            const idCliente = clienteData[0].id;

            // Registrar la venta
            setMensaje("Registrando datos de la venta...");
            const ventaData = {
                cliente_id: idCliente,
                producto: dataParsed.producto,
                precio: dataParsed.valorProducto,
                cuotas: dataParsed.numeroCuotas,
                valor_cuota: dataParsed.valorCuota,
                frecuencia: dataParsed.frecuencia,
                fecha_cobro: (dataParsed.frecuencia === "mensual" || dataParsed.frecuencia === "quincenal") ? dataParsed.fechaCobro : null,
                dia_semana: dataParsed.frecuencia === "semanal" ? parseInt(dataParsed.diaSemana) : null,
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
                    <InputField
                        label="Valor producto"
                        register={register}
                        name="valorProducto"
                        required={true}
                        errors={errors}
                        value={valorProductoFormateado}
                        handleOnChange={handleValorProductoChange}
                    />
                </div>

                <InputField
                    label="Número de cuotas"
                    register={register}
                    name="numeroCuotas"
                    required={true}
                    errors={errors}
                    type='number'
                    handleOnChange={handleNumeroCuotasChange}
                />

                <InputField
                    label="Valor cuota"
                    register={register}
                    name="valorCuota"
                    required={true}
                    errors={errors}
                    value={valorCuotaFormateado}
                    handleOnChange={handleValorCuotaChange}
                />

                <div className="col-span-2">
                    <p className={`${valorVenta < valorProducto ? "text-red-500" : ""}`}>
                        <span className="text-black">Valor venta:</span> {valorVentaFormateado}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className={`${valorInteres < 0 ? "text-red-500" : ""}`}>
                        <span className="text-black">Interes:</span> {Math.round(valorInteres)} %
                    </p>
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




