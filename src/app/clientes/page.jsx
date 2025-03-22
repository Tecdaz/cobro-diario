"use client"

import { useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { getClients } from '@/lib/db';
import ClientCard from '@/components/ClientCard';
import SearchBar from '@/components/SearchBar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Clientes() {
    const { handleTitleChange } = useLayout();
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        handleTitleChange("Lista de Clientes");
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const clients = await getClients();
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
        fetchData();
    }, [handleTitleChange]);

    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
        if (!searchValue.trim()) {
            setFilteredClients(clients);
            return;
        }

        const filtered = clients.filter(client =>
            client.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
            client.telefono.includes(searchValue) ||
            client.direccion.toLowerCase().includes(searchValue.toLowerCase()) ||
            client.documento.includes(searchValue)
        );
        setFilteredClients(filtered);
    };

    return (
        <ProtectedRoute>
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-lg">Cargando clientes...</div>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen bg-gray-50">
                    <div className="bg-white shadow-sm p-4">
                        <SearchBar onSearch={handleSearch} />
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
                                    href={`/clientes/${client.id}`}
                                    client={client}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </ProtectedRoute>
    );
} 