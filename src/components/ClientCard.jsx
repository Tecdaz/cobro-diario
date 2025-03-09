import Link from 'next/link';

export default function ClientCard({ client, href, className = '' }) {
    return (
        <Link href={href} className={`block hover:bg-orange-100 transition-colors ${className}`}>
            <div className="flex flex-col p-4">
                <div className="text-lg font-bold">{client.nombre}</div>
                <div className="text-sm text-gray-600">ID: {client.id}</div>
                <div className="flex justify-between mt-2 text-sm">
                    <div>📞 {client.telefono}</div>
                    <div>📍 {client.direccion}</div>
                </div>
            </div>
        </Link>
    );
} 