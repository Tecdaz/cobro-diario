"use client"

import InputField from "@/components/InputField";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useLayout } from "@/contexts/LayoutContext";
import { getClientData, createVentaData } from "@/lib/db";
import SelectField from "@/components/SelectField";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RenovarVenta() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth()
    const params = useParams();
    const router = useRouter();
    const { id } = params;

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

    const [valorVenta, setValorVenta] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);
    const [numeroCuotas, setNumeroCuotas] = useState(0);
    const [valorInteres, setValorInteres] = useState(0);
    const [valorProducto, setValorProducto] = useState(0);
    const [clientData, setClientData] = useState(null);
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

            const nuevoValorVenta = numero * numeroCuotas;
            setValorVenta(nuevoValorVenta);

            if (valorProducto > 0) {
                setValorInteres(((nuevoValorVenta / valorProducto) - 1) * 100);
            }
        }
    }, [setValue, numeroCuotas, valorProducto, formatMoneda]);

    // Manejador para el campo de número de cuotas
    const handleNumeroCuotasChange = useCallback((e) => {
        const valor = e.target.value || '';
        const numCuotas = parseInt(valor.replace(/[^\d]/g, ''), 10) || 0;

        setNumeroCuotas(numCuotas);
        setValue('numeroCuotas', numCuotas);

        const nuevoValorVenta = numCuotas * valorCuota;
        setValorVenta(nuevoValorVenta);

        if (valorProducto > 0) {
            setValorInteres(((nuevoValorVenta / valorProducto) - 1) * 100);
        }
    }, [setValue, valorCuota, valorProducto]);

    const handleFrecuenciaChange = (e) => {
        setFrecuenciaSeleccionada(e.target.value);
    }

    useEffect(() => {
        handleTitleChange("Renovar venta");

        const fetchClientData = async () => {
            try {
                const data = await getClientData(id);
                if (data && data.length > 0) {
                    setClientData(data[0]);
                    setValue('nombre', data[0].nombre);
                    setValue('telefono', data[0].telefono);
                    setValue('direccion', data[0].direccion);
                    setValue('documento', data[0].documento);
                }
            } catch (error) {
                console.error("Error al cargar datos del cliente:", error);
                setError("Error al cargar los datos del cliente");
            }
        };

        if (id) {
            fetchClientData();
        }

        // Establecer fecha mínima
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        setFechaMinima(`${año}-${mes}-${dia}`);
    }, [id, handleTitleChange, setValue]);

    const validarFechaCobro = (value) => {
        if (!value) return "Este campo es requerido";

        const fechaSeleccionada = new Date(value);
        const fechaActual = new Date();

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
        setMensaje("Registrando renovación de venta...");

        try {
            const limpiarValorMonetario = (valor) => {
                if (typeof valor === 'number') return valor;
                if (!valor) return 0;
                return parseInt(valor.toString().replace(/[^\d]/g, ''), 10) || 0;
            };

            const dataParsed = {
                ...data,
                valorProducto: limpiarValorMonetario(data.valorProducto),
                valorCuota: limpiarValorMonetario(data.valorCuota),
                numeroCuotas: parseInt(data.numeroCuotas || 0, 10)
            };

            const ventaData = {
                cliente_id: id,
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

            setMensaje("¡Venta renovada correctamente! Redirigiendo...");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            console.error("Error al renovar venta:", error);
            setError("Error al renovar la venta: " + (error.message || "Por favor intente nuevamente"));
            setMensaje(null);
            setIsSubmitting(false);
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
                handleOnChange={handleFrecuenciaChange}
            />

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
                        <span className="text-black">Interés:</span> {Math.round(valorInteres)} %
                    </p>
                </div>
            </div>

            <button
                className="bg-orange-500 text-white p-2 rounded-md mt-2 hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Procesando...' : 'Renovar venta'}
            </button>
        </form>
    );
} 