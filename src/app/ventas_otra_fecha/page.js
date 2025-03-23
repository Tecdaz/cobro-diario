"use client"
import CardCliente from "@/components/card_cliente/CardCliente";
import SearchBar from "@/components/SearchBar";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getVentasOtrasFechas } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";

export default function VentasOtraFecha() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
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
            venta.nombre?.toLowerCase().includes(searchTermLower) ||
            venta.direccion?.toLowerCase().includes(searchTermLower)
        );
        setFilteredData(filtered);
    }

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