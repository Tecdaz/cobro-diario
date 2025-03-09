import Link from 'next/link';

export default function VentaCard({ venta }) {
    // Formatear la fecha
    const fecha = new Date(venta.created_at).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Formatear valores monetarios
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg">{venta.cliente.nombre}</h3>
                    <p className="text-sm text-gray-600">{venta.cliente.documento}</p>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-sm text-gray-500">{fecha}</span>
                    <Link
                        href={`/ventas_nuevas/${venta.id}`}
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-600">Valor producto:</p>
                    <p className="font-medium">{formatMoney(venta.precio)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Valor cuota:</p>
                    <p className="font-medium">{formatMoney(venta.valor_cuota)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Total venta:</p>
                    <p className="font-medium">{formatMoney(venta.valor_cuota * venta.cuotas)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Cuotas:</p>
                    <p className="font-medium">{venta.cuotas}</p>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{venta.cliente.telefono}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{venta.cliente.direccion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 