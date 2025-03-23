"use client"

import { useLayout } from "@/contexts/LayoutContext";

export default function NavigationModal() {
    const { showNavModal, confirmNavigation, cancelNavigation } = useLayout();

    if (!showNavModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">¿Estás seguro que deseas salir?</h3>
                <p className="mb-6 text-gray-600">Si sales ahora, podrías perder los cambios no guardados.</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={cancelNavigation}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmNavigation}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
} 