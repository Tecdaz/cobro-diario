"use client"

import IconoCliente from "@/components/card_cliente/IconoCliente";
import InfoCardCliente from "@/components/card_cliente/InfoCardCliente";
import Link from "next/link";
import InfoExtra from "./InfoExtra";
import { useState } from "react";
import { User, Calendar } from "lucide-react";

export default function CardCliente(props) {
    const [infoExtra, setInfoExtra] = useState(false)
    const toggleInfoExtra = () => setInfoExtra(!infoExtra)

    const { href, data, className } = props

    // Calculamos las cuotas restantes
    const cuotasPagadas = data.valor_cuota > 0 ? Math.floor((data.cuotas * data.valor_cuota - data.saldo) / data.valor_cuota) : 0;

    // Función para formatear moneda
    const formatMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    };

    // Función para obtener las clases de color para la frecuencia
    const getFrecuenciaClasses = (frecuencia) => {
        const classes = {
            'diario': 'bg-blue-100 text-blue-800',
            'semanal': 'bg-green-100 text-green-800',
            'quincenal': 'bg-purple-100 text-purple-800',
            'mensual': 'bg-orange-100 text-orange-800'
        };

        return classes[frecuencia] || 'bg-gray-100 text-gray-800';
    };

    // Función para formatear la frecuencia
    const formatFrecuencia = (frecuencia) => {
        const frecuencias = {
            'diario': 'Diario',
            'semanal': 'Semanal',
            'quincenal': 'Quincenal',
            'mensual': 'Mensual'
        };

        return frecuencias[frecuencia] || frecuencia;
    };

    return (
        <div className="flex flex-col bg-white">
            <div className={`flex h-auto border border-gray-200 items-center px-4 py-2 gap-3 hover:bg-gray-50 ${className}`}>
                <IconoCliente
                    status={data.status}
                    onClick={toggleInfoExtra}
                    isOpen={infoExtra}
                    className="flex-shrink-0"
                />
                <Link href={href} className="flex-1 min-w-0">
                    <div className="flex flex-col justify-between flex-1">
                        {/* Primera fila: Nombre y badge de frecuencia */}
                        <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-gray-900 truncate mr-2">{data.nombre}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getFrecuenciaClasses(data.frecuencia)}`}>
                                {formatFrecuencia(data.frecuencia)}
                            </span>
                        </div>

                        {/* Segunda fila: Dirección y avance */}
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-500 truncate mr-2">
                                {data.direccion || 'Sin dirección'}
                            </div>
                            <div className="text-xs whitespace-nowrap">
                                <span className="font-medium">{cuotasPagadas}</span>
                                <span className="text-gray-500"> de {data.cuotas}</span>
                            </div>
                        </div>

                        {/* Tercera fila: Cuota y saldo */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Cuota</span>
                                <span className="font-medium">{formatMoneda(data.valor_cuota)}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-gray-500">Saldo</span>
                                <span className="font-medium text-green-600">{formatMoneda(data.saldo)}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
            {infoExtra && (
                <div className="border-x border-b border-gray-200">
                    <InfoExtra data={data} />
                </div>
            )}
        </div>
    )
}