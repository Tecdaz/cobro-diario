"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLayout } from "@/contexts/LayoutContext";
import { getDataCuotas } from "@/lib/db";
import { useAuth } from "@/contexts/auth-context";

export default function HistorialPagos() {
    const { id } = useParams();
    const router = useRouter();
    const { handleTitleChange } = useLayout();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        handleTitleChange("Historial de Pagos");

        const fetchData = async () => {
            try {
                const ventaData = await getDataCuotas(id);
                if (ventaData && ventaData.length > 0) {
                    setData(ventaData[0]);

                    // Crear un array con todos los eventos (cuotas, abonos y no pagos)
                    const todosEventos = [];

                    // Agregar cuotas
                    if (ventaData[0].cuota && ventaData[0].cuota.length > 0) {
                        ventaData[0].cuota.forEach(cuota => {
                            todosEventos.push({
                                tipo: 'cuota',
                                fecha: cuota.created_at,
                                cantidad: cuota.cantidad,
                                valor: cuota.cantidad * ventaData[0].valor_cuota,
                                id: cuota.id,
                                fecha_cobro: cuota.created_at
                            });
                        });
                    }

                    // Agregar abonos
                    if (ventaData[0].abono && ventaData[0].abono.length > 0) {
                        ventaData[0].abono.forEach(abono => {
                            // Solo agregar abonos con valor mayor a 0
                            if (abono.valor > 0) {
                                todosEventos.push({
                                    tipo: 'abono',
                                    fecha: abono.created_at,
                                    valor: abono.valor,
                                    id: abono.id,
                                    fecha_cobro: abono.created_at
                                });
                            }
                        });
                    }

                    // Agregar no pagos
                    if (ventaData[0].no_pago && ventaData[0].no_pago.length > 0) {
                        ventaData[0].no_pago.forEach(noPago => {
                            todosEventos.push({
                                tipo: 'no_pago',
                                fecha: noPago.created_at,
                                id: noPago.id,
                                fecha_cobro: noPago.created_at
                            });
                        });
                    }

                    // Ordenar eventos por fecha, del más reciente al más antiguo
                    todosEventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                    setEventos(todosEventos);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, handleTitleChange]);

    const formatFecha = (fechaStr) => {
        if (!fechaStr) return "Fecha no disponible";
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    };

    if (isLoading) return <div className="flex justify-center items-center h-full">Cargando...</div>;
    if (!data) return <div className="flex justify-center items-center h-full">No se encontraron datos para esta venta</div>;

    // Calcular el saldo actual
    const valorTotal = data.cuotas * data.valor_cuota;
    const totalCuotas = data.cuota.reduce((acc, cuota) => acc + (cuota.cantidad * data.valor_cuota), 0);
    const totalAbonos = data.abono.reduce((acc, abono) => acc + abono.valor, 0);
    const saldoActual = valorTotal - totalCuotas - totalAbonos;

    return (
        <div className="flex flex-col p-4 gap-4">
            {/* Datos del cliente */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-semibold mb-2">{data.cliente.nombre}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Teléfono:</p>
                        <p className="font-medium">{data.cliente.telefono}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Dirección:</p>
                        <p className="font-medium">{data.cliente.direccion}</p>
                    </div>
                </div>
            </div>

            {/* Resumen de la venta */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-2">Resumen del Crédito</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-600">Valor cuota:</p>
                        <p className="font-medium">{formatMoneda(data.valor_cuota)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total cuotas:</p>
                        <p className="font-medium">{data.cuotas}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Valor total:</p>
                        <p className="font-medium">{formatMoneda(valorTotal)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Saldo actual:</p>
                        <p className="font-medium">{formatMoneda(saldoActual)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Fecha otorgamiento:</p>
                        <p className="font-medium">{formatFecha(data.created_at)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">No pagos:</p>
                        <p className="font-medium text-red-600">{data.no_pago ? data.no_pago.length : 0}</p>
                    </div>
                </div>
            </div>

            {/* Historial de pagos */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Historial de Pagos</h3>

                {eventos.length === 0 ? (
                    <p className="text-center text-gray-500 my-4">No hay registros de pagos todavía</p>
                ) : (
                    <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                        {eventos.map((evento, index) => (
                            <div key={`${evento.tipo}-${evento.id}`} className={`p-3 mb-2 rounded-md ${evento.tipo === 'cuota' ? 'bg-green-50 border-l-4 border-green-500' :
                                evento.tipo === 'abono' ? 'bg-blue-50 border-l-4 border-blue-500' :
                                    'bg-red-50 border-l-4 border-red-500'
                                }`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">
                                            {evento.tipo === 'cuota' ? `Pago de ${evento.cantidad} cuota${evento.cantidad > 1 ? 's' : ''}` :
                                                evento.tipo === 'abono' ? 'Abono' :
                                                    'No pago'}
                                        </h4>
                                        <p className="text-xs text-gray-500">Fecha: {formatFecha(evento.fecha)}</p>
                                    </div>
                                    {(evento.tipo === 'cuota' || evento.tipo === 'abono') && (
                                        <span className="font-medium">
                                            {formatMoneda(evento.valor)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Botón para volver */}
            <button
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-300 mt-2"
            >
                Volver
            </button>
        </div>
    );
} 