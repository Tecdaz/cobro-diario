"use client"

import { use, useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { getClients } from '@/lib/db';
import ClientCard from '@/components/ClientCard';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { buscarEnCampos } from '@/lib/utils';

export default function page() {
    const { handleTitleChange } = useLayout();
    const { user, cartera } = useAuth();
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // fetch data
        handleTitleChange("Renovar venta");
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const clients = await getClients(user, cartera.id_cartera);
                setClients(clients || []);
                setFilteredClients(clients || []);
            } catch (error) {
                console.error("Error", error);
                setClients([]);
                setFilteredClients([]);
            } finally {
                setIsLoading(false);
            }
        }
        if (user && cartera.id_cartera) {
            fetchData();
        }
    }, [handleTitleChange, user, cartera.id_cartera]);

    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
        const filtered = buscarEnCampos(clients, searchValue, ['nombre', 'telefono', 'direccion']);
        setFilteredClients(filtered);
    };

    return (
        <>{
            isLoading ? (
                <div className="flex justify-center items-center min-h-screen" >
                    <div className="text-lg">Cargando clientes...</div>
                </div>)
                :
                (<div className="flex flex-col min-h-screen bg-gray-50">
                    <div className="bg-white shadow-sm p-4">
                        <SearchBar onChange={handleSearch} value={searchTerm} />
                    </div>

                    {!filteredClients.length ? (
                        <div className="flex justify-center items-center flex-1 p-4">
                            <div className="text-lg text-gray-500">
                                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col p-4 gap-2">
                            {filteredClients.map((client) => (
                                <ClientCard
                                    key={client.id}
                                    href={`/renovar_venta/${client.id}`}
                                    client={client}
                                />
                            ))}
                        </div>
                    )}
                </div>)
        }
        </>

    )
}
