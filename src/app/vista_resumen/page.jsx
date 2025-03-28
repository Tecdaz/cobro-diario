'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useAuth } from "@/contexts/AuthContext"
import { useLayout } from '@/contexts/LayoutContext'
import { useEffect, useState } from 'react'
export default function VistaResumen() {
    const { user, cartera } = useAuth()
    const { handleTitleChange } = useLayout()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        handleTitleChange("Vista Resumen")
    }, [])

    useEffect(() => {
        if (user && cartera) {
            setIsLoading(false)
        }
    }, [user, cartera])

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div id="resumen" className="flex flex-col items-center justify-center gap-8 px-4 py-8 bg-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6">Agustin Arias - Tandil1 - 28/03/2025</h1>
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-5xl">
                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Clientes</h2>
                    <div className="w-full">
                        <p className="font-medium mb-4">Total de clientes: 10</p>

                        <p className="font-medium">Clientes nuevos: 5</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Direccion</TableHead>
                                    <TableHead>Telefono</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Juan Perez</TableCell>
                                    <TableCell>1234567890</TableCell>
                                    <TableCell>Av. Siempre Viva 123</TableCell>
                                    <TableCell>1234567890</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Juan Perez</TableCell>
                                    <TableCell>1234567890</TableCell>
                                    <TableCell>Av. Siempre Viva 123</TableCell>
                                    <TableCell>1234567890</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Ventas</h2>
                    <div className="w-full">
                        <p className="font-medium mb-4">Total de ventas: 10</p>

                        <p className="font-medium">Ventas nuevas: 5</p>
                        <Table className="w-full max-w-full mb-6">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Frecuencia</TableHead>
                                    <TableHead>Cuotas</TableHead>
                                    <TableHead>Valor Cuota</TableHead>
                                    <TableHead>Interes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Juan Perez</TableCell>
                                    <TableCell>100000</TableCell>
                                    <TableCell>Semanal</TableCell>
                                    <TableCell>4</TableCell>
                                    <TableCell>80000</TableCell>
                                    <TableCell>10%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <p className="font-medium mb-4">Renovaciones: 5</p>
                        <Table className="w-full overflow-x-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Frecuencia</TableHead>
                                    <TableHead>Cuotas</TableHead>
                                    <TableHead>Valor Cuota</TableHead>
                                    <TableHead>Interes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Juan Perez</TableCell>
                                    <TableCell>100000</TableCell>
                                    <TableCell>Semanal</TableCell>
                                    <TableCell>4</TableCell>
                                    <TableCell>80000</TableCell>
                                    <TableCell>10%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Cobros</h2>
                    <div className="w-full">
                        <div className="flex gap-4  mb-4">
                            <p className="font-medium flex-1">Cobros pretendidos: 10</p>
                            <p className="font-medium flex-1">Dinero pretendido: 100000</p>
                        </div>
                        <p className="font-medium mb-2">Cobros realizados</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p className="font-medium">De hoy: 10</p>
                            <p className="font-medium">Otras fechas: 3</p>
                            <p className="font-medium">No pago: 4</p>
                            <p className="font-medium">Siguiente dia: 3</p>
                        </div>
                        <p className="font-medium">Dinero cobrado: 320000</p>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Gastos Ingresos</h2>
                    <div className="w-full">
                        <p className="font-medium mb-4">Movimientos del dia</p>

                        <p className="font-medium">Ingresos: 10000</p>
                        <Table className="mb-6">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Observacion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Aporte capital</TableCell>
                                    <TableCell>10000</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <p className="font-medium mb-4">Gastos: 20000</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Observacion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Gasolina</TableCell>
                                    <TableCell>20000</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Caja</h2>
                    <div className="w-full">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Caja inicial</TableCell>
                                    <TableCell>100000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Ventas</TableCell>
                                    <TableCell>-300000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cobro</TableCell>
                                    <TableCell>400000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gastos</TableCell>
                                    <TableCell>-100000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Ingresos</TableCell>
                                    <TableCell>10000</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Caja final</TableCell>
                                    <TableCell>300000</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

