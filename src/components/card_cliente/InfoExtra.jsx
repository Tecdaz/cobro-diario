import { Info } from "lucide-react"
import { Button } from "../ui/button"
import InfoCardCliente from "./InfoCardCliente"

export default function InfoExtra(props) {
    const { data } = props
    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex gap-2">
                <Button className="flex-1 border-black" variant='outline'>Pagos</Button>
                <Button className="flex-1 border-black" variant="outline">Fotos</Button>
            </div>
            <div className="flex flex-col gap-2">
                <InfoCardCliente title="Telefono" value={data.telefono} />
                <InfoCardCliente title="Direccion" value={data.direccion} />
                <InfoCardCliente title="Documento" value={data.documento} />
                <InfoCardCliente title="Valor" value={data.cuotas * data.valor_cuota} />
                <InfoCardCliente title="Cuotas" value={data.cuotas} />
                <InfoCardCliente title="Fecha" value={data.created_at} />
                <InfoCardCliente title="Frecuencia" value={data.frecuencia} />
            </div>
        </div>
    )
}