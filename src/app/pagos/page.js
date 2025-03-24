"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLayout } from "@/contexts/LayoutContext";
import { supabase } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpDown, Search, List, X } from "lucide-react";

export default function Pagos() {
    const router = useRouter();
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [ordenarPor, setOrdenarPor] = useState("nombre");
    const [ordenAscendente, setOrdenAscendente] = useState(true);
    const [filtroFrecuencia, setFiltroFrecuencia] = useState("");

    useEffect(() => {
        handleTitleChange("Historial de Pagos");

        const fetchVentas = async () => {
            try {

                const { data, error } = await supabase
                    .from('venta')
                    .select(`
                            id,
                            producto,
                            precio,
                            valor_cuota,
                            cuotas,
                            frecuencia,
                            created_at,
                            activa,
                            cliente(
                                id,
                                nombre,
                                telefono,
                                direccion,
                                documento
                            )
                        `)
                    .eq('cobrador', user.id)
                    .eq('id_cartera', cartera.id_cartera)
                    .eq('activa', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setVentas(data || []);

                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener ventas:", error);
                setIsLoading(false);
            }
        };

        if (user && cartera.id_cartera) {
            fetchVentas();
        }
    }, [handleTitleChange, user, cartera.id_cartera]);

    const formatFecha = (fechaStr) => {
        if (!fechaStr) return "Fecha no disponible";
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    };

    const handleVerHistorial = (id) => {
        router.push(`/pagos/${id}`);
    };

    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    const handleOrdenar = (campo) => {
        if (ordenarPor === campo) {
            setOrdenAscendente(!ordenAscendente);
        } else {
            setOrdenarPor(campo);
            setOrdenAscendente(true);
        }
    };

    const handleFiltroFrecuencia = (frecuencia) => {
        if (filtroFrecuencia === frecuencia) {
            setFiltroFrecuencia(""); // Si ya está seleccionado, lo deseleccionamos
        } else {
            setFiltroFrecuencia(frecuencia);
        }
    };

    const formatFrecuencia = (frecuencia) => {
        const frecuencias = {
            'diario': 'Diario',
            'semanal': 'Semanal',
            'quincenal': 'Quincenal',
            'mensual': 'Mensual'
        };

        return frecuencias[frecuencia] || frecuencia;
    };

    const ventasFiltradas = ventas.filter(venta => {
        // Filtro por texto de búsqueda
        const coincideTexto =
            venta.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            venta.cliente.documento.toLowerCase().includes(busqueda.toLowerCase()) ||
            venta.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
            venta.cliente.direccion.toLowerCase().includes(busqueda.toLowerCase());

        // Filtro por frecuencia
        const coincideFrecuencia = filtroFrecuencia === "" || venta.frecuencia === filtroFrecuencia;

        return coincideTexto && coincideFrecuencia;
    });

    const ventasOrdenadas = [...ventasFiltradas].sort((a, b) => {
        let valorA, valorB;

        switch (ordenarPor) {
            case 'nombre':
                valorA = a.cliente.nombre.toLowerCase();
                valorB = b.cliente.nombre.toLowerCase();
                break;
            case 'documento':
                valorA = a.cliente.documento;
                valorB = b.cliente.documento;
                break;
            case 'fecha':
                valorA = new Date(a.created_at);
                valorB = new Date(b.created_at);
                break;
            case 'valor':
                valorA = a.valor_cuota * a.cuotas;
                valorB = b.valor_cuota * b.cuotas;
                break;
            default:
                valorA = a.cliente.nombre.toLowerCase();
                valorB = b.cliente.nombre.toLowerCase();
        }

        if (valorA < valorB) return ordenAscendente ? -1 : 1;
        if (valorA > valorB) return ordenAscendente ? 1 : -1;
        return 0;
    });

    if (isLoading) return <div className="flex justify-center items-center h-full">Cargando...</div>;

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    placeholder="Buscar por nombre, documento o producto"
                    value={busqueda}
                    onChange={handleBusqueda}
                />
            </div>

            {/* Filtros de frecuencia */}
            <div className="flex flex-wrap gap-2 mb-3">
                <button
                    onClick={() => handleFiltroFrecuencia("")}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center ${filtroFrecuencia === ""
                        ? 'bg-gray-200 text-gray-800 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todos
                    {filtroFrecuencia === "" && (
                        <X size={14} className="ml-1" />
                    )}
                </button>

                <button
                    onClick={() => handleFiltroFrecuencia("diario")}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center ${filtroFrecuencia === "diario"
                        ? 'bg-blue-200 text-blue-800 font-medium'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                >
                    Diario
                    {filtroFrecuencia === "diario" && (
                        <X size={14} className="ml-1" />
                    )}
                </button>

                <button
                    onClick={() => handleFiltroFrecuencia("semanal")}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center ${filtroFrecuencia === "semanal"
                        ? 'bg-green-200 text-green-800 font-medium'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                >
                    Semanal
                    {filtroFrecuencia === "semanal" && (
                        <X size={14} className="ml-1" />
                    )}
                </button>

                <button
                    onClick={() => handleFiltroFrecuencia("quincenal")}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center ${filtroFrecuencia === "quincenal"
                        ? 'bg-purple-200 text-purple-800 font-medium'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                >
                    Quincenal
                    {filtroFrecuencia === "quincenal" && (
                        <X size={14} className="ml-1" />
                    )}
                </button>

                <button
                    onClick={() => handleFiltroFrecuencia("mensual")}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center ${filtroFrecuencia === "mensual"
                        ? 'bg-orange-200 text-orange-800 font-medium'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                        }`}
                >
                    Mensual
                    {filtroFrecuencia === "mensual" && (
                        <X size={14} className="ml-1" />
                    )}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-4 gap-2 p-3 font-medium text-sm border-b text-gray-600">
                    <button
                        className="flex items-center col-span-2"
                        onClick={() => handleOrdenar('nombre')}
                    >
                        Cliente {ordenarPor === 'nombre' && <ArrowUpDown size={16} className="ml-1" />}
                    </button>
                    <button
                        className="flex items-center"
                        onClick={() => handleOrdenar('fecha')}
                    >
                        Fecha {ordenarPor === 'fecha' && <ArrowUpDown size={16} className="ml-1" />}
                    </button>
                    <button
                        className="flex items-center"
                        onClick={() => handleOrdenar('valor')}
                    >
                        Valor {ordenarPor === 'valor' && <ArrowUpDown size={16} className="ml-1" />}
                    </button>
                </div>

                {ventasOrdenadas.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">No se encontraron ventas</p>
                ) : (
                    <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                        {ventasOrdenadas.map((venta) => (
                            <div
                                key={venta.id}
                                className="grid grid-cols-4 gap-2 p-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleVerHistorial(venta.id)}
                            >
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${venta.frecuencia === 'diario' ? 'bg-blue-100 text-blue-800' :
                                            venta.frecuencia === 'semanal' ? 'bg-green-100 text-green-800' :
                                                venta.frecuencia === 'quincenal' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-orange-100 text-orange-800'
                                            }`}>
                                            {formatFrecuencia(venta.frecuencia)}
                                        </span>
                                        <p className="font-medium">{venta.cliente.nombre}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{venta.cliente.direccion}</p>
                                </div>
                                <div className="text-sm flex items-center">
                                    {formatFecha(venta.created_at)}
                                </div>
                                <div className="text-sm flex items-center">
                                    <span>{formatMoneda(venta.valor_cuota * venta.cuotas)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 