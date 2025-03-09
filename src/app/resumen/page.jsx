"use client";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clientesHoy, getPaymentsRegistered, totalClientes } from "@/lib/db";

export default function Resumen() {
    const { handleTitleChange } = useLayout();
    useEffect(() => {
        handleTitleChange("Resumen")

        // fetch data
        const fetchData = async () => {
            try {
                const totalCliente = await totalClientes();
                const totalClientesHoy = await clientesHoy();
                const totalPagosRegistrados = await getPaymentsRegistered();
                console.log("Data", totalCliente);
                console.log("Data", totalClientesHoy);
            } catch (error) {
                console.error("Error", error);
            }
        }
        fetchData();

    }, [handleTitleChange]);

    const financialData = [
        { label: "Número Clientes", value: "66" },
        { label: "Clientes Nuevos", value: "0" },
        { label: "Pagos Registrados", value: "1/12" },
        { label: "Caja Inicial", value: "$330,090.14" },
        { label: "Recaudo Esperado", value: "$244,000.00" },
        { label: "Efectivo/Transferencia", value: "$0.00 / $0.00" },
        { label: "Saldo en Caja", value: "$330,090.14", highlight: true }
    ];

    return (
        <Card className="w-full max-w-md mx-auto shadow-sm h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">
                    Agustin Arias
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {financialData.map((item, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-2 rounded-md ${item.highlight
                                ? "bg-blue-50 font-semibold text-blue-700"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="text-gray-600">{item.label}</span>
                            <Badge
                                variant={item.highlight ? "default" : "secondary"}
                                className="text-right"
                            >
                                {item.value}
                            </Badge>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                        No Pagos
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                        Configuración
                    </button>
                    <button className="text-sm text-blue-500 hover:text-blue-700">
                        Regresar
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}