import IconoCliente from "@/components/card_cliente/IconoCliente";
import InfoCardCliente from "@/components/card_cliente/InfoCardCliente";

export default function CardCliente(props) {

    const { nombre, cuota, saldo, className, status } = props
    return (
        <div className={`flex h-16 border-b-2 border-gray-200 items-center px-4 py-2 gap-4 ${className}`}>
            <IconoCliente status={status} />
            <div className="flex flex-col flex-1">
                <div className="text-lg font-bold">{nombre}</div>
                <div className="flex gap-2 justify-between">
                    <InfoCardCliente title="Cuota" value={cuota} />
                    <InfoCardCliente title="Saldo" value={saldo} />
                </div>
            </div>


        </div>
    )
}