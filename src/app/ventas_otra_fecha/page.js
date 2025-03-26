"use client"
import CardCliente from "@/components/card_cliente/CardCliente";
import SearchBar from "@/components/SearchBar";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getVentasOtrasFechas } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { X, ArrowUpDown } from "lucide-react";

export default function VentasOtraFecha() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroFrecuencia, setFiltroFrecuencia] = useState("");
    const [ordenarPor, setOrdenarPor] = useState("nombre");
    const [ordenAscendente, setOrdenAscendente] = useState(true);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredData(data);
            return;
        }

        const searchTermLower = term.toLowerCase();
        const filtered = data.filter(venta =>
            venta.nombre?.toLowerCase().includes(searchTermLower)
        );
        setFilteredData(filtered);
    }

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

    const handleOrdenar = (campo) => {
        if (ordenarPor === campo) {
            setOrdenAscendente(!ordenAscendente);
        } else {
            setOrdenarPor(campo);
            setOrdenAscendente(true);
        }
    };

    useEffect(() => {
        handleTitleChange("Ventas otras fechas")
    }, [handleTitleChange]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataFetch = await getVentasOtrasFechas(user, cartera.id_cartera);
                setData(dataFetch);
                setFilteredData(dataFetch);
            }
            catch (error) {
                console.error("Error al obtener ventas:", error);
            }
        }

        if (user && cartera.id_cartera) {
            fetchData();
        }
    }, [user, cartera.id_cartera]);

    // Aplicar filtros
    useEffect(() => {
        let filtered = [...data];

        // Aplicar filtro de búsqueda
        if (searchTerm.trim()) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(venta =>
                venta.nombre?.toLowerCase().includes(searchTermLower)
            );
        }

        // Aplicar filtro de frecuencia
        if (filtroFrecuencia) {
            filtered = filtered.filter(venta => venta.frecuencia === filtroFrecuencia);
        }

        // Aplicar ordenamiento
        filtered.sort((a, b) => {
            const valorA = a.nombre.toLowerCase();
            const valorB = b.nombre.toLowerCase();

            if (valorA < valorB) return ordenAscendente ? -1 : 1;
            if (valorA > valorB) return ordenAscendente ? 1 : -1;
            return 0;
        });

        setFilteredData(filtered);
    }, [data, searchTerm, filtroFrecuencia, ordenAscendente]);

    return (
        <div className="flex flex-col">
            <div className="h-16 p-4 flex items-center gap-4 justify-between w-full">
                <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Buscar por nombre..." />
            </div>

            {/* Filtros de frecuencia */}
            <div className="flex flex-wrap gap-2 px-4 mb-3">
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

            {/* Encabezados de ordenamiento */}
            <div className="grid grid-cols-1 gap-2 p-3 font-medium text-sm border-b text-gray-600">
                <button
                    className="flex items-center"
                    onClick={() => handleOrdenar('nombre')}
                >
                    Cliente {ordenarPor === 'nombre' && <ArrowUpDown size={16} className="ml-1" />}
                </button>
            </div>

            {filteredData.length === 0 ? (
                <div className="flex justify-center items-center p-4 text-gray-500">
                    No se encontraron resultados
                </div>
            ) : (
                filteredData.map((venta, index) => (
                    <CardCliente
                        href={`/ingresar_cuota/${venta.id}`}
                        key={venta.id}
                        className={index % 2 === 0 && "bg-gray-50"}
                        data={{
                            ...venta,
                            nombre: venta.nombre,
                            direccion: venta.direccion,
                            telefono: venta.telefono,
                            documento: venta.documento
                        }}
                    />
                ))
            )}
        </div>
    );
} 