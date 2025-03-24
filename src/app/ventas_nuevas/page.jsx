"use client"

import { useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { getVentasHoy } from '@/lib/db';
import VentaCard from '@/components/VentaCard';
import { useAuth } from '@/contexts/AuthContext';
export default function VentasNuevas() {
    const { user, cartera } = useAuth();
    const { handleTitleChange } = useLayout();
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleTitleChange("Ventas de Hoy");

        const fetchVentas = async () => {
            try {
                setIsLoading(true);
                const data = await getVentasHoy(user, cartera.id_cartera);
                setVentas(data || []);
            } catch (error) {
                console.error("Error al cargar ventas:", error);
                setVentas([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVentas();
    }, [handleTitleChange]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando ventas...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {ventas.length} {ventas.length === 1 ? "Venta" : "Ventas"} Realizadas
                </h2>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {ventas.length === 0 ? (
                <div className="flex justify-center items-center flex-1">
                    <div className="text-lg text-gray-500">
                        No hay ventas registradas hoy
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {ventas.map((venta) => (
                        <VentaCard key={venta.id} venta={venta} />
                    ))}
                </div>
            )}
        </div>
    );
} 