"use client"

import { use, useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { getClients } from '@/lib/db';
import ClientCard from '@/components/ClientCard';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/contexts/AuthContext';

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
        if (!searchValue.trim()) {
            setFilteredClients(clients);
            return;
        }

        const filtered = clients.filter(client =>
            client.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
            client.telefono.includes(searchValue) ||
            client.direccion.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredClients(filtered);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando clientes...</div>
            </div>
        );
    }

    if (!filteredClients.length) {
        return (
            <div className="flex flex-col gap-4 p-4">
                <div className="sticky z-10 bg-gray-50 p-4">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                    <div className="text-lg text-gray-500">
                        {searchTerm ? "No se encontraron clientes" : "No hay clientes disponibles"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="sticky z-10 bg-gray-50 p-4">
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex flex-col">
                {filteredClients.map((client) => (
                    <ClientCard
                        key={client.id}
                        href={`/renovar_venta/${client.id}`}
                        client={client}
                    />
                ))}
            </div>
        </div>
    )
}
