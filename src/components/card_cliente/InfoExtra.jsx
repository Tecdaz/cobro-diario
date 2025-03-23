import { Info } from "lucide-react"
import { Button } from "../ui/button"
import InfoCardCliente from "./InfoCardCliente"
import { useRouter } from "next/navigation"

export default function InfoExtra(props) {
    const { data } = props
    const router = useRouter()

    const handleVerPagos = () => {
        router.push(`/pagos/${data.id}`)
    }

    // Función para formatear moneda
    const formatMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    };

    // Función para formatear fecha
    const formatFecha = (fechaStr) => {
        if (!fechaStr) return "Fecha no disponible";
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
        <div className="flex flex-col gap-2 p-4">
            <div className="flex gap-2">
                <Button
                    className="flex-1 border-black"
                    variant='outline'
                    onClick={handleVerPagos}
                >
                    Pagos
                </Button>
                <Button className="flex-1 border-black" variant="outline">Fotos</Button>
            </div>
            <div className="flex flex-col gap-2">
                <InfoCardCliente title="Teléfono" value={data.telefono} />
                <InfoCardCliente title="Dirección" value={data.direccion} />
                <InfoCardCliente title="Documento" value={data.documento} />
                <InfoCardCliente title="Valor" value={formatMoneda(data.cuotas * data.valor_cuota)} />
                <InfoCardCliente title="Cuotas" value={data.cuotas} />
                <InfoCardCliente title="Fecha" value={formatFecha(data.created_at)} />
                <InfoCardCliente title="Frecuencia" value={formatFrecuencia(data.frecuencia)} />
            </div>
        </div>
    )
}