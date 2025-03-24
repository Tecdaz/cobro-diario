"use client";

import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getResumenDiario, getCajaInicial, totalClientes, clientesHoy } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";

export default function Resumen() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [resumen, setResumen] = useState(null);
    const [cajaInicial, setCajaInicial] = useState(0);
    const [totalClientesCount, setTotalClientesCount] = useState(0);
    const [clientesNuevos, setClientesNuevos] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        handleTitleChange("Resumen del Día");

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [resumenData, cajaInicialData, totalClientesData, clientesNuevosData] = await Promise.all([
                    getResumenDiario(user, cartera.id_cartera),
                    getCajaInicial(user, cartera.id_cartera),
                    totalClientes(user, cartera.id_cartera),
                    clientesHoy(user, cartera.id_cartera)
                ]);
                setResumen(resumenData);
                setCajaInicial(cajaInicialData);
                setTotalClientesCount(totalClientesData);
                setClientesNuevos(clientesNuevosData);
            } catch (error) {
                console.error("Error", error);
                setError('Error al cargar los datos del resumen');
            } finally {
                setIsLoading(false);
            }
        };
        if (user && cartera.id_cartera) {
            fetchData();
        }
    }, [handleTitleChange, user, cartera.id_cartera]);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando resumen...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4 gap-4">
            {/* Fecha */}
            <div className="text-sm text-gray-500 text-center">
                {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>

            {/* Clientes */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Clientes</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Total Clientes:</p>
                        <p className="font-medium">{totalClientesCount}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Clientes Nuevos Hoy:</p>
                        <p className="font-medium text-green-600">{clientesNuevos}</p>
                    </div>
                </div>
            </div>

            {/* Ventas */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Ventas del Día</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Ventas Nuevas:</p>
                        <p className="font-medium">{resumen.ventasNuevas}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total en Productos:</p>
                        <p className="font-medium">{formatMoney(resumen.totalVentasProducto)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total en Cuotas:</p>
                        <p className="font-medium">{formatMoney(resumen.totalVentasCuotas)}</p>
                    </div>
                </div>
            </div>

            {/* Cobros */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Cobros del Día</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Cobros Registrados:</p>
                        <p className="font-medium">{resumen.cobrosRegistrados}/{resumen.cobrosPorRealizar}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Cobrado:</p>
                        <p className="font-medium text-green-600">{formatMoney(resumen.totalCobros)}</p>
                    </div>
                </div>
            </div>

            {/* Gastos e Ingresos */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Gastos e Ingresos</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Total Gastos:</p>
                        <p className="font-medium text-red-500">{formatMoney(resumen.totalGastos)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Ingresos Extra:</p>
                        <p className="font-medium text-green-500">{formatMoney(resumen.totalIngresos)}</p>
                    </div>
                </div>
            </div>

            {/* Resumen de Caja */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Resumen de Caja</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Caja Inicial:</p>
                        <p className="font-medium">{formatMoney(cajaInicial)}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Movimientos del Día:</p>
                        <p className="font-medium">{formatMoney(resumen.cajaFinal)}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-600">Caja Final:</p>
                        <p className="text-xl font-semibold text-orange-600">
                            {formatMoney(cajaInicial + resumen.cajaFinal)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}