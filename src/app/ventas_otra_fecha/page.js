"use client"
import CardCliente from "@/components/card_cliente/CardCliente";
import SearchBar from "@/components/SearchBar";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getVentasOtrasFechas } from "@/lib/db";

export default function VentasOtraFecha() {
    const { handleTitleChange } = useLayout();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredData(data);
            return;
        }

        const searchTermLower = term.toLowerCase();
        const filtered = data.filter(venta =>
            venta.cliente.nombre?.toLowerCase().includes(searchTermLower) ||
            venta.cliente.direccion?.toLowerCase().includes(searchTermLower)
        );
        setFilteredData(filtered);
    }

    useEffect(() => {
        handleTitleChange("Ventas otras fechas")
    }, [handleTitleChange]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataFetch = await getVentasOtrasFechas();
                setData(dataFetch);
                setFilteredData(dataFetch);
            }
            catch (error) {
                console.log("Error", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="h-16 p-4 flex items-center gap-4 justify-between w-full">
                <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Buscar por nombre o dirección..." />
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
                            nombre: venta.cliente.nombre,
                            direccion: venta.cliente.direccion,
                            telefono: venta.cliente.telefono,
                            documento: venta.cliente.documento
                        }}
                    />
                ))
            )}
        </div>
    );
} 