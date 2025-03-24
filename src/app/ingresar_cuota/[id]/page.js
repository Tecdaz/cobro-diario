"use client"
import InputField from "@/components/InputField";
import InputRadio from "@/components/InputRadio";
import { Watch } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { getDataCuotas, createAbono, createCuota, createSiguienteDia, createNoPago, getSaldos, updateVentaData } from "@/lib/db";
import { useParams, useRouter } from "next/navigation";
import SelectField from "@/components/SelectField";
import Link from "next/link";

export default function Page() {
    const { handleTitleChange, setRequireConfirmation, handleNavigation } = useLayout();
    const [data, setData] = useState([
        {
            cliente: {
                nombre: "",
                telefono: "",
                direccion: ""
            },
            valor_cuota: 0,
            cuotas: 0,
            cuota: [],
            abono: [],
            no_pago: []
        }
    ]);

    const router = useRouter();
    const [nuevoSaldo, setNuevoSaldo] = useState(0);
    const [saldoActual, setSaldoActual] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [valorAbonoFormateado, setValorAbonoFormateado] = useState('');
    const [totalVentaFormateado, setTotalVentaFormateado] = useState('');
    const [saldoActualFormateado, setSaldoActualFormateado] = useState('');
    const [nuevoSaldoFormateado, setNuevoSaldoFormateado] = useState('');

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            pago: "cuota",
            cuotas: '',
            abono: 0,
            totalVenta: 0,
            saldoActual: 0,
            nuevoSaldo: 0,
            producto: "Credito",
            metodoPago: "efectivo"
        }
    });

    const validateNuevoSaldo = (value) => {
        if (value < 0) {
            return "El nuevo saldo no puede ser negativo. Por favor, ingresa un valor válido de cuotas o abono.";
        }
        return true; // Si el valor es válido
    };

    const watchedValues = watch(["cuotas", "abono", "pago"]);

    const params = useParams();
    const { id } = params;
    // 
    // Función para formatear moneda (memoizada)
    const formatMoneda = useCallback((valor) => {
        if (valor === undefined || valor === null) return '';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    }, []);
    useEffect(() => {
        handleTitleChange("Ingresar cuota")
        setRequireConfirmation(true); // Activar la confirmación al navegar

        if (id) {
            const fetchData = async () => {
                try {
                    const dataFetched = await getDataCuotas(id);
                    const saldo = await getSaldos(id);

                    if (dataFetched && dataFetched.length > 0 && saldo && saldo.length > 0) {
                        const saldoValue = saldo[0]['saldo'];
                        const totalVenta = dataFetched[0]['cuotas'] * dataFetched[0]['valor_cuota'];

                        // Actualizamos los estados en batch para evitar múltiples renderizados
                        setData(dataFetched);
                        setSaldoActual(saldoValue);
                        setNuevoSaldo(saldoValue);

                        // Actualizamos los valores del formulario
                        setValue("totalVenta", totalVenta);
                        setValue("saldoActual", saldoValue);
                        setValue("nuevoSaldo", saldoValue);

                        // Reiniciamos los valores de entrada
                        setValue("cuotas", '');
                        setValue("abono", 0);
                        setValorAbonoFormateado('');

                        // Actualizamos los formatos
                        setTotalVentaFormateado(formatMoneda(totalVenta));
                        setSaldoActualFormateado(formatMoneda(saldoValue));
                        setNuevoSaldoFormateado(formatMoneda(saldoValue));
                    }
                }
                catch (error) {
                    console.error("Error al cargar datos:", error);
                }
            }

            fetchData();
        }

        return () => {
            setRequireConfirmation(false); // Desactivar al desmontar el componente
        };
    }, [id, handleTitleChange, setValue, setRequireConfirmation, formatMoneda]);

    useEffect(() => {
        const pagoActual = watchedValues[2]; // valor de pago

        if (!watchedValues || !data || data.length === 0) return;

        // Limpieza de campos cuando se cambia el tipo de pago
        if (pagoActual === "cuota") {
            // Si cambiamos a cuota, reiniciamos el abono
            if (watchedValues[1] !== 0) {
                setValue("abono", 0);
                setValorAbonoFormateado('');
            }
        } else if (pagoActual === "abono") {
            // Si cambiamos a abono, reiniciamos las cuotas
            if (watchedValues[0] !== '') {
                setValue("cuotas", '');
            }
        }

        // Cálculo del nuevo saldo
        let nuevoSaldoCalculado = saldoActual;
        if (pagoActual === "cuota") {
            const numCuotas = parseInt(watchedValues[0] || 0);
            const valorCuota = data[0].valor_cuota || 0;
            nuevoSaldoCalculado = saldoActual - (numCuotas * valorCuota);
        } else if (pagoActual === "abono") {
            const valorAbono = parseInt(watchedValues[1] || 0);
            nuevoSaldoCalculado = saldoActual - valorAbono;
        }

        // Solo actualizamos si realmente hay un cambio
        if (nuevoSaldo !== nuevoSaldoCalculado) {
            setNuevoSaldo(nuevoSaldoCalculado);
            setValue("nuevoSaldo", nuevoSaldoCalculado);
        }
    }, [watchedValues, data, setValue, saldoActual, nuevoSaldo]);



    useEffect(() => {
        // Actualizar los valores formateados cada vez que cambien los valores numéricos
        if (nuevoSaldo !== undefined) {
            setNuevoSaldoFormateado(formatMoneda(nuevoSaldo));
        }

        if (saldoActual !== undefined) {
            setSaldoActualFormateado(formatMoneda(saldoActual));
        }

        if (data && data.length > 0 && data[0].cuotas !== undefined && data[0].valor_cuota !== undefined) {
            const totalVenta = data[0].cuotas * data[0].valor_cuota;
            setTotalVentaFormateado(formatMoneda(totalVenta));
        }
    }, [nuevoSaldo, saldoActual, data, formatMoneda]);

    // Manejador de cambio para el campo de abono con formato de moneda
    const handleAbonoChange = useCallback((e) => {
        // Obtener solo los dígitos del valor ingresado
        const valorInput = e.target.value || '';
        const valorNumerico = valorInput.toString().replace(/[^\d]/g, '');

        // Siempre establecer un valor válido para 'abono'
        if (valorNumerico === '') {
            setValue('abono', 0);
            // Para el display usamos cadena vacía
            setValorAbonoFormateado('');
        } else {
            const numero = parseInt(valorNumerico, 10);

            // Actualizar el valor real en el formulario (sin formato)
            setValue('abono', numero);

            // Actualizar el valor formateado para mostrar
            setValorAbonoFormateado(formatMoneda(numero));
        }
    }, [setValue, formatMoneda]);

    const onSubmit = async (dataForm) => {
        setIsLoading(true);

        // Aseguramos que todos los valores son números
        const datosParseados = {
            ...dataForm,
            cuotas: dataForm.cuotas ? parseInt(dataForm.cuotas) : 0,
            abono: dataForm.abono ? parseInt(dataForm.abono) : 0,
            totalVenta: parseInt(data[0]['cuotas'] * data[0]['valor_cuota']),
            saldoActual: parseInt(saldoActual),
            nuevoSaldo: parseInt(nuevoSaldo),
        }

        if (datosParseados.nuevoSaldo < 0) {
            setIsLoading(false);
            return;
        }

        try {
            if (datosParseados.pago === 'cuota') {
                const dataCuota = {
                    venta_id: id,
                    cantidad: datosParseados.cuotas,
                    valor_cuota: data[0]['valor_cuota'],
                    total: datosParseados.cuotas * data[0]['valor_cuota']
                }
                await createCuota(dataCuota);
            }
            else if (datosParseados.pago === 'abono') {
                const dataAbono = {
                    valor: datosParseados.abono,
                    venta_id: id
                }
                await createAbono(dataAbono);
            }
            else if (datosParseados.pago === 'siguiente dia') {
                const dataSiguienteDia = {
                    venta_id: id
                }
                await createAbono({
                    valor: 0,
                    venta_id: id
                })
                await createSiguienteDia(dataSiguienteDia);
            }
            else if (datosParseados.pago === 'no pago') {
                await createAbono({
                    valor: 0,
                    venta_id: id
                })
                await createNoPago(id);
            }

            // Verificar si el nuevo saldo es 0 para marcar la venta como inactiva
            if (datosParseados.nuevoSaldo === 0) {
                await updateVentaData(id, {
                    activa: false
                });
            }

            setIsLoading(false);
            router.push(`/dashboard`);

        } catch (error) {
            console.error("Error al procesar el pago:", error);
            setIsLoading(false);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    }

    const pagoSeleccionado = watch("pago");
    return (
        <div className="flex flex-col gap-4 p-4 min-h-full h-fit justify-between">
            {/* Información del Cliente */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-semibold mb-4">{data[0].cliente.nombre}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Teléfono:</p>
                        <p className="font-medium">{data[0].cliente.telefono}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Dirección:</p>
                        <p className="font-medium">{data[0].cliente.direccion}</p>
                    </div>
                </div>
            </div>

            {/* Estado del Crédito */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Estado del Crédito</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Valor cuota:</p>
                        <p className="font-medium">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(data[0].valor_cuota)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total cuotas:</p>
                        <p className="font-medium">{data[0].cuotas}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Fecha otorgamiento:</p>
                        <p className="font-medium">{new Date(data[0].created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Saldo actual:</p>
                        <p className="font-medium">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(saldoActual)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Cuotas pagadas:</p>
                        <p className="font-medium">{data[0].cuota.length}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Cuotas pendientes:</p>
                        <p className="font-medium">{data[0].cuotas - data[0].cuota.length}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">No pagos:</p>
                        <p className="font-medium text-red-600">{data[0].no_pago ? data[0].no_pago.length : 0}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Abonos realizados:</p>
                        <p className="font-medium">{data[0].abono.length}</p>
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            <form className="flex flex-col gap-2 flex-1 justify-between" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-1">
                    <InputRadio register={register} label="Cuota" name="pago" value="cuota" />
                    <InputRadio register={register} label="Abono" name="pago" value="abono" />
                    <InputRadio register={register} label="No pago" name="pago" value="no pago" />
                    <InputRadio register={register} label="Siguiente dia" name="pago" value="siguiente dia" />
                </div>
                <InputField label="Producto" register={register} name="producto" required={true} errors={errors} isDisabled={true} value="Credito" />
                <div>
                    <InputField
                        label="Total venta"
                        register={register}
                        name="totalVenta"
                        required={true}
                        errors={errors}
                        isDisabled={true}
                        value={totalVentaFormateado}
                    />
                    <InputField
                        label="Saldo actual"
                        register={register}
                        name="saldoActual"
                        required={true}
                        errors={errors}
                        isDisabled={true}
                        value={saldoActualFormateado}
                    />
                </div>

                {pagoSeleccionado !== 'no pago' && pagoSeleccionado !== 'siguiente dia' && (
                    <>
                        {pagoSeleccionado === 'cuota' ? (
                            <InputField
                                label="Numero de cuotas"
                                name="cuotas"
                                register={register}
                                required={true}
                                type='number'
                                errors={errors}
                                handleOnChange={(e) => setValue('cuotas', e.target.value)}
                            />
                        ) : (
                            <InputField
                                label="Valor abono"
                                name="abono"
                                register={register}
                                required={true}
                                errors={errors}
                                value={valorAbonoFormateado || ''}
                                handleOnChange={handleAbonoChange}
                            />
                        )}
                        <InputField
                            label="Nuevo saldo"
                            register={register}
                            name="nuevoSaldo"
                            required={true}
                            errors={errors}
                            isDisabled={true}
                            value={nuevoSaldoFormateado}
                            validate={validateNuevoSaldo}
                        />
                        <SelectField
                            label="Metodo de pago"
                            register={register}
                            name="metodoPago"
                            options={
                                [{ value: "efectivo", label: "Efectivo" }, { value: "transferencia", label: "Transferencia" }]
                            }
                            required={true}
                            errors={errors}
                        />
                    </>
                )}

                <div className="flex-1 flex flex-col justify-end pb-4">
                    <div className="flex gap-4 items-center">
                        <button
                            type="button"
                            onClick={() => handleNavigation("/")}
                            className="border-gray-500 border-2 p-2 rounded-md mt-2 w-full"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>

                        <button
                            className={`${isLoading ? 'bg-blue-300' : 'bg-blue-500'} text-white p-2 rounded-md mt-2 w-full flex justify-center items-center gap-2`}
                            onClick={handleSubmit(onSubmit)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                'Registrar cuota'
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}
