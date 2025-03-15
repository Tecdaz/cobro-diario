"use client"

import IconoCliente from "@/components/card_cliente/IconoCliente";
import InfoCardCliente from "@/components/card_cliente/InfoCardCliente";
import Link from "next/link";
import InfoExtra from "./InfoExtra";
import { useState } from "react";
import { User } from "lucide-react";

export default function CardCliente(props) {
    const [infoExtra, setInfoExtra] = useState(false)
    const toggleInfoExtra = () => setInfoExtra(!infoExtra)

    const { href, data, className } = props

    // Calculamos las cuotas restantes
    const cuotasPagadas = data.valor_cuota > 0 ? Math.floor((data.cuotas * data.valor_cuota - data.saldo) / data.valor_cuota) : 0;

    return (
        <div className="flex flex-col bg-white">
            <div className={`flex h-16 border border-gray-200 items-center px-3 py-2 gap-3 hover:bg-gray-50 ${className}`}>
                <IconoCliente
                    status={data.status}
                    onClick={toggleInfoExtra}
                    isOpen={infoExtra}
                    className="flex-shrink-0"
                />
                <Link href={href} className="flex-1 min-w-0">
                    <div className="flex flex-col justify-between flex-1">
                        <div className="grid grid-cols-[minmax(0,1fr)_1fr_48px] gap-4 items-center">
                            <div className="flex flex-col gap-2 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{data.nombre}</div>
                                <div className="text-sm text-gray-500 truncate">{data.direccion || 'Sin dirección'}</div>
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                <InfoCardCliente title="Cuota" value={data.valor_cuota} />
                                <InfoCardCliente title="Saldo" value={data.saldo} className="text-green-600" />
                            </div>
                            <div className="text-sm text-center">
                                {cuotasPagadas} de {data.cuotas}
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