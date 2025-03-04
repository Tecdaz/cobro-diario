"use client"

import IconoCliente from "@/components/card_cliente/IconoCliente";
import InfoCardCliente from "@/components/card_cliente/InfoCardCliente";
import Link from "next/link";
import InfoExtra from "./InfoExtra";
import { useState } from "react";

export default function CardCliente(props) {
    const [infoExtra, setInfoExtra] = useState(false)
    const toggleInfoExtra = () => setInfoExtra(!infoExtra)

    const { href, data, className } = props
    return (
        <div className="flex flex-col">
            <div className={`flex h-16 border-t-2 border-gray-200 items-center px-4 py-2 gap-4 ${className}`}>
                <IconoCliente status={data.status} onClick={toggleInfoExtra} />
                <Link href={href} className="flex-1">
                    <div className="flex flex-col flex-1">
                        <div className="text-lg font-bold">{data.nombre}</div>
                        <div className="flex gap-2 justify-between">
                            <InfoCardCliente title="Cuota" value={data.valor_cuota} />
                            <InfoCardCliente title="Saldo" value={data.saldo} />
                        </div>
                    </div>
                </Link>
            </div>
            {
                infoExtra &&
                <InfoExtra data={data} />
            }
        </div>

    )
}