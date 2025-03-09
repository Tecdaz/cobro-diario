"use client"

import { useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { getClientData, updateClientData } from '@/lib/db';
import { useParams, useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import { useForm } from 'react-hook-form';

export default function EditarCliente() {
    const { handleTitleChange } = useLayout();
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        handleTitleChange("Editar Cliente");

        const fetchClientData = async () => {
            try {
                setIsLoading(true);
                const data = await getClientData(id);
                if (data && data.length > 0) {
                    const client = data[0];
                    setValue('nombre', client.nombre);
                    setValue('telefono', client.telefono);
                    setValue('direccion', client.direccion);
                    setValue('documento', client.documento);
                }
            } catch (error) {
                console.error("Error al cargar datos del cliente:", error);
                setError('Error al cargar los datos del cliente');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchClientData();
        }
    }, [id, handleTitleChange, setValue]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            await updateClientData(id, {
                nombre: data.nombre,
                telefono: data.telefono,
                direccion: data.direccion,
                documento: data.documento
            });
            router.push("/clientes");
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            setError('Error al actualizar los datos del cliente');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando datos del cliente...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-xl font-semibold mb-4">Datos del Cliente</h2>

                    <div className="space-y-4">
                        <InputField
                            label="Nombre"
                            register={register}
                            name="nombre"
                            required="El nombre es requerido"
                            errors={errors}
                        />

                        <InputField
                            label="Documento"
                            register={register}
                            name="documento"
                            required="El documento es requerido"
                            errors={errors}
                        />

                        <InputField
                            label="Teléfono"
                            register={register}
                            name="telefono"
                            required="El teléfono es requerido"
                            errors={errors}
                            type="tel"
                        />

                        <InputField
                            label="Dirección"
                            register={register}
                            name="direccion"
                            required="La dirección es requerida"
                            errors={errors}
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
} 