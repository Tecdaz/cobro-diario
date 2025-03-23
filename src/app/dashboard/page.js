'use client'
import CardCliente from "@/components/card_cliente/CardCliente";
import SearchBar from "@/components/SearchBar";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { getTodayCobros, getTodayPayments, getCart } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
    const { handleTitleChange } = useLayout();
    const { setCartera, user, cartera } = useAuth();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [vrfActive, setVrfActive] = useState(false);

    const handleVrfChange = () => {
        setVrfActive(!vrfActive);

    }

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
        handleTitleChange(`Inicio ${cartera.cartera.nombre ? `- ${cartera.cartera.nombre}` : ""}`)
    }, [handleTitleChange, cartera]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (vrfActive) {
                    const dataFetch = await getTodayPayments(user, cartera.id_cartera);

                    setData(dataFetch);
                    setFilteredData(dataFetch);
                }
                else {
                    const dataFetch = await getTodayCobros(user, cartera.id_cartera);

                    setData(dataFetch);
                    setFilteredData(dataFetch);
                }
            }
            catch (error) {

            }
        }
        fetchData();

    }, [vrfActive, setCartera, user]);


    return (
        <div className="flex flex-col">
            <div className="h-16 p-4 flex items-center gap-4 justify-between w-full">
                <div className='flex gap-2 items-center'>
                    <input onClick={handleVrfChange} type="checkbox" />
                    <label>Vrf</label>
                </div>
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
                        data={venta}
                    />
                ))
            )}
        </div>
    );
} 