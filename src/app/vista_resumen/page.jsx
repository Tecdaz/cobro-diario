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

import {
    totalClientes,
    clientesNuevos,
    getNombreCobrador,
    getVentasDelDia,
    getPretendidosDelDia,
    getAbonosDelDia,
    getCuotasDelDia,
    getNoPagosDelDia,
    getSiguienteDiaDelDia
} from "@/lib/db"
import { getStartOfTheDay, getEndOfTheDay } from "@/lib/utils"

export default function VistaResumen() {
    const { user, cartera } = useAuth()
    const { handleTitleChange } = useLayout()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalClientesState, setTotalClientesState] = useState(0)
    const [clientesNuevosState, setClientesNuevosState] = useState([])
    const [nombreCobrador, setNombreCobrador] = useState('')
    const [ventasDelDia, setVentasDelDia] = useState([])
    const [renovacionesDelDia, setRenovacionesDelDia] = useState([])
    const [ventasNuevasDelDia, setVentasNuevasDelDia] = useState([])
    const [pretendidosDelDia, setPretendidosDelDia] = useState([])
    const [dineroPretendido, setDineroPretendido] = useState(0)
    const [abonosDelDia, setAbonosDelDia] = useState([])
    const [cuotasDelDia, setCuotasDelDia] = useState([])
    const [dineroCobrado, setDineroCobrado] = useState(0)
    const [cobrosHoy, setCobrosHoy] = useState(0)
    const [cobrosOtrasFechas, setCobrosOtrasFechas] = useState(0)
    const [cobrosNoPago, setCobrosNoPago] = useState(0)
    const [cobrosSiguienteDia, setCobrosSiguienteDia] = useState(0)



    useEffect(() => {
        handleTitleChange("Vista Resumen")
    }, [])

    const calculateCobros = (abonos, cuotas, pretendidos) => {
        const idsTotalCobros = [...abonos.filter(abono => abono.valor > 0).map(abono => abono.venta_id), ...cuotas.map(cuota => cuota.venta_id)]

        const idsVentasPretendidas = pretendidos.map(venta => venta.id)

        let cobrosHoyCount = 0
        let cobrosOtrasFechasCount = 0

        for (const id of idsTotalCobros) {
            if (idsVentasPretendidas.includes(id)) {
                cobrosHoyCount++
            } else {
                cobrosOtrasFechasCount++
            }
        }

        setCobrosHoy(cobrosHoyCount)
        setCobrosOtrasFechas(cobrosOtrasFechasCount)
    }


    const calculateDineroCobrado = (abonos, cuotas) => {
        const dineroCobrado = abonos.reduce((acc, abono) => acc + abono.valor, 0) + cuotas.reduce((acc, cuota) => acc + cuota.total, 0)
        setDineroCobrado(dineroCobrado)
    }

    const calculateDineroPretendido = (ventas) => {
        const dineroPretendido = ventas.reduce((acc, venta) => acc + venta.valor_cuota, 0)
        setDineroPretendido(dineroPretendido)
    }

    const assignVentasNuevas = (ventas) => {
        const ventasNuevas = ventas.filter(
            venta =>
                (venta.cliente.created_at >=
                    getStartOfTheDay().toISOString()) && (venta.cliente.created_at <= getEndOfTheDay().toISOString()))
        setVentasNuevasDelDia(ventasNuevas)
    }

    const assignRenovaciones = (ventas) => {
        const renovaciones = ventas.filter(
            venta => venta.cliente.created_at < getStartOfTheDay().toISOString())
        setRenovacionesDelDia(renovaciones)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [totalClientesData,
                    clientesNuevosData,
                    nombreCobradorData,
                    ventasDelDiaData,
                    pretendidosDelDiaData,
                    abonosDelDiaData,
                    cuotasDelDiaData,
                    noPagosDelDiaData,
                    siguienteDiaDelDiaData] = await Promise.all([
                        totalClientes(user, cartera.id_cartera),
                        clientesNuevos(user, cartera.id_cartera),
                        getNombreCobrador(user),
                        getVentasDelDia(user, cartera.id_cartera),
                        getPretendidosDelDia(user, cartera.id_cartera),
                        getAbonosDelDia(user, cartera.id_cartera),
                        getCuotasDelDia(user, cartera.id_cartera),
                        getNoPagosDelDia(user, cartera.id_cartera),
                        getSiguienteDiaDelDia(user, cartera.id_cartera)
                    ])
                setTotalClientesState(totalClientesData)
                setClientesNuevosState(clientesNuevosData)
                setNombreCobrador(nombreCobradorData)
                setVentasDelDia(ventasDelDiaData)
                setPretendidosDelDia(pretendidosDelDiaData)
                setAbonosDelDia(abonosDelDiaData)
                setCuotasDelDia(cuotasDelDiaData)
                setCobrosNoPago(noPagosDelDiaData)
                setCobrosSiguienteDia(siguienteDiaDelDiaData)


                calculateDineroPretendido(pretendidosDelDiaData)
                calculateDineroCobrado(abonosDelDiaData, cuotasDelDiaData)
                calculateCobros(abonosDelDiaData, cuotasDelDiaData, pretendidosDelDiaData)
                assignVentasNuevas(ventasDelDiaData)
                assignRenovaciones(ventasDelDiaData)

            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        if (user && cartera.id_cartera) {
            fetchData()
        }
    }, [user, cartera])

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div id="resumen" className="flex flex-col items-center justify-center gap-8 px-4 py-8 bg-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6">{nombreCobrador} - {cartera.cartera.nombre} - {new Date().toLocaleDateString()}</h1>
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-5xl">
                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Clientes</h2>
                    <div className="w-full">
                        <p className="font-medium mb-4">Total de clientes: {totalClientesState}</p>

                        <p className="font-medium">Clientes nuevos: {clientesNuevosState.length}</p>
                        {clientesNuevosState.length > 0 && (
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
                                    {clientesNuevosState.map((cliente) => (
                                        <TableRow key={cliente.id}>
                                            <TableCell>{cliente.nombre}</TableCell>
                                            <TableCell>{cliente.documento}</TableCell>
                                            <TableCell>{cliente.direccion}</TableCell>
                                            <TableCell>{cliente.telefono}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Ventas</h2>
                    <div className="w-full">
                        <p className="font-medium mb-4">Total de ventas: {ventasDelDia.length}</p>

                        <p className="font-medium">Ventas nuevas: {ventasNuevasDelDia.length}</p>
                        {ventasNuevasDelDia.length > 0 && (
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
                        )}

                        <p className="font-medium mb-4">Renovaciones: {renovacionesDelDia.length}</p>
                        {renovacionesDelDia.length > 0 && (
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
                        )}
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Cobros</h2>
                    <div className="w-full">
                        <div className="flex gap-4  mb-4">
                            <p className="font-medium flex-1">Cobros pretendidos: {pretendidosDelDia.length}</p>
                            <p className="font-medium flex-1">Dinero pretendido: {dineroPretendido}</p>
                        </div>
                        <p className="font-medium mb-2">Cobros realizados</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p className="font-medium">De hoy: {cobrosHoy}</p>
                            <p className="font-medium">Otras fechas: {cobrosOtrasFechas}</p>
                            <p className="font-medium">No pago: {cobrosNoPago.length}</p>
                            <p className="font-medium">Siguiente dia: {cobrosSiguienteDia.length}</p>
                        </div>
                        <p className="font-medium">Dinero cobrado: {dineroCobrado}</p>
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

