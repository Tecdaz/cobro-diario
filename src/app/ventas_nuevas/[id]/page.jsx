"use client"

import { useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { getVentaById, updateVentaData, deleteVenta, checkVentaRecords, deleteAllVentaRecords } from '@/lib/db';
import { useParams, useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { useForm } from 'react-hook-form';

export default function EditarVenta() {
    const { handleTitleChange } = useLayout();
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [ventaOriginal, setVentaOriginal] = useState(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    const valorProducto = watch('valorProducto', 0);
    const numeroCuotas = watch('numeroCuotas', 0);
    const valorCuota = watch('valorCuota', 0);

    const valorTotal = numeroCuotas * valorCuota;
    const interes = valorProducto > 0 ? ((valorTotal / valorProducto) - 1) * 100 : 0;

    useEffect(() => {
        handleTitleChange("Editar Venta");

        const fetchVentaData = async () => {
            try {
                setIsLoading(true);
                const data = await getVentaById(id);
                if (data) {
                    setVentaOriginal(data);
                    setValue('producto', data.producto);
                    setValue('valorProducto', data.precio);
                    setValue('numeroCuotas', data.cuotas);
                    setValue('valorCuota', data.valor_cuota);
                    setValue('frecuencia', data.frecuencia);
                }
            } catch (error) {
                console.error("Error al cargar datos de la venta:", error);
                setError('Error al cargar los datos de la venta');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchVentaData();
        }
    }, [id, handleTitleChange, setValue]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            await updateVentaData(id, {
                producto: data.producto,
                precio: data.valorProducto,
                cuotas: data.numeroCuotas,
                valor_cuota: data.valorCuota,
                frecuencia: data.frecuencia
            });
            router.push("/ventas_nuevas");
        } catch (error) {
            console.error("Error al actualizar venta:", error);
            setError('Error al actualizar los datos de la venta');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer.')) {
            try {
                setIsDeleting(true);
                setError('');

                // Verificar si hay registros relacionados
                const records = await checkVentaRecords(id);

                // Si hay registros relacionados, mostrar una confirmación adicional
                if (records.totalRecords > 0) {
                    let mensaje = 'Esta venta tiene registros relacionados:\n';

                    if (records.hasCuotas) mensaje += '- Cuotas registradas\n';
                    if (records.hasAbonos) mensaje += '- Abonos registrados\n';
                    if (records.hasNoPagos) mensaje += '- Registros de no pagos\n';
                    if (records.hasSiguienteDia) mensaje += '- Programado para otro día\n';

                    mensaje += '\nSi continúa, todos estos registros serán eliminados. ¿Desea continuar?';

                    if (!window.confirm(mensaje)) {
                        setIsDeleting(false);
                        return;
                    }

                    // Eliminar todos los registros relacionados
                    await deleteAllVentaRecords(id);
                }

                // Eliminar la venta
                await deleteVenta(id);
                router.push("/ventas_nuevas");
            } catch (error) {
                console.error("Error al eliminar venta:", error);
                setError('Error al eliminar la venta');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando datos de la venta...</div>
            </div>
        );
    }

    if (!ventaOriginal) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-500">Venta no encontrada</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">Datos del Cliente</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Nombre:</p>
                        <p className="font-medium">{ventaOriginal.cliente.nombre}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Documento:</p>
                        <p className="font-medium">{ventaOriginal.cliente.documento}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Teléfono:</p>
                        <p className="font-medium">{ventaOriginal.cliente.telefono}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Dirección:</p>
                        <p className="font-medium">{ventaOriginal.cliente.direccion}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-xl font-semibold mb-4">Datos de la Venta</h2>

                    <div className="space-y-4">
                        <InputField
                            label="Producto"
                            register={register}
                            name="producto"
                            required="El producto es requerido"
                            errors={errors}
                        />

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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <InputField
                                    label="Valor producto"
                                    register={register}
                                    name="valorProducto"
                                    type="number"
                                    required="El valor del producto es requerido"
                                    errors={errors}
                                />
                            </div>

                            <InputField
                                label="Número de cuotas"
                                register={register}
                                name="numeroCuotas"
                                type="number"
                                required="El número de cuotas es requerido"
                                errors={errors}
                            />

                            <InputField
                                label="Valor cuota"
                                register={register}
                                name="valorCuota"
                                type="number"
                                required="El valor de la cuota es requerido"
                                errors={errors}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <p className="text-gray-600">Valor total:</p>
                                <p className={`font-medium ${valorTotal < valorProducto ? 'text-red-500' : ''}`}>
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTotal)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Interés:</p>
                                <p className={`font-medium ${interes < 0 ? 'text-red-500' : ''}`}>
                                    {Math.round(interes)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={isSubmitting || isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={isSubmitting || isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar Venta'
                        )}
                    </button>
                    <button
                        type="submit"
                        className="flex-1 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={isSubmitting || isDeleting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Procesando...
                            </>
                        ) : (
                            'Guardar Cambios'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
} 