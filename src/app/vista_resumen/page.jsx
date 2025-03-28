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
    getSiguienteDiaDelDia,
    getGastosIngresosDelDia,
    getCajaInicial
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
    const [gastosIngresosDelDia, setGastosIngresosDelDia] = useState([])
    const [gastosDelDia, setGastosDelDia] = useState([])
    const [ingresosDelDia, setIngresosDelDia] = useState([])
    const [totalGastosDelDia, setTotalGastosDelDia] = useState(0)
    const [totalIngresosDelDia, setTotalIngresosDelDia] = useState(0)
    const [movimientosDelDia, setMovimientosDelDia] = useState([])
    const [cajaInicial, setCajaInicial] = useState(0)
    const [totalVentasDelDia, setTotalVentasDelDia] = useState(0)


    useEffect(() => {
        handleTitleChange("Vista Resumen")
    }, [])

    const calculateTotalVentasDelDia = (ventas) => {
        const totalVentas = ventas.reduce((acc, venta) => acc + venta.precio, 0)
        setTotalVentasDelDia(totalVentas * -1)
    }

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value);
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

    const categorizeGastosIngresos = (gastosIngresos) => {
        const gastos = gastosIngresos.filter(gasto => gasto.tipo === 'gasto')
        const ingresos = gastosIngresos.filter(ingreso => ingreso.tipo === 'ingreso')

        const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.valor, 0)
        const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.valor, 0)
        const movimientos = totalIngresos - totalGastos
        setTotalGastosDelDia(totalGastos)
        setTotalIngresosDelDia(totalIngresos)
        setGastosDelDia(gastos)
        setIngresosDelDia(ingresos)
        setMovimientosDelDia(movimientos)
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
                    siguienteDiaDelDiaData,
                    gastosIngresosDelDiaData,
                    cajaInicialData
                ] = await Promise.all([
                    totalClientes(user, cartera.id_cartera),
                    clientesNuevos(user, cartera.id_cartera),
                    getNombreCobrador(user),
                    getVentasDelDia(user, cartera.id_cartera),
                    getPretendidosDelDia(user, cartera.id_cartera),
                    getAbonosDelDia(user, cartera.id_cartera),
                    getCuotasDelDia(user, cartera.id_cartera),
                    getNoPagosDelDia(user, cartera.id_cartera),
                    getSiguienteDiaDelDia(user, cartera.id_cartera),
                    getGastosIngresosDelDia(user, cartera.id_cartera),
                    getCajaInicial(user, cartera.id_cartera)
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
                setGastosIngresosDelDia(gastosIngresosDelDiaData)
                setCajaInicial(cajaInicialData)

                calculateTotalVentasDelDia(ventasDelDiaData)
                categorizeGastosIngresos(gastosIngresosDelDiaData)
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

                        <p className="font-medium mb-4">Ventas nuevas: {ventasNuevasDelDia.length}</p>
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
                            <p className="font-medium flex-1">Dinero pretendido: {formatCurrency(dineroPretendido)}</p>
                        </div>
                        <p className="font-medium mb-2">Cobros realizados</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p className="font-medium">De hoy: {cobrosHoy}</p>
                            <p className="font-medium">Otras fechas: {cobrosOtrasFechas}</p>
                            <p className="font-medium">No pago: {cobrosNoPago.length}</p>
                            <p className="font-medium">Siguiente dia: {cobrosSiguienteDia.length}</p>
                        </div>
                        <p className="font-medium">Dinero cobrado: {formatCurrency(dineroCobrado)}</p>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Gastos Ingresos</h2>
                    <div className="w-full">
                        <p className="font-medium mb-4">Movimientos del dia: {formatCurrency(movimientosDelDia)}</p>

                        <p className="font-medium mb-4">Ingresos: {formatCurrency(totalIngresosDelDia)}</p>
                        {ingresosDelDia.length > 0 && (
                            <Table className="mb-6">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Concepto</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Observacion</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ingresosDelDia.map((ingreso) => (
                                        <TableRow key={ingreso.id}>
                                            <TableCell>{ingreso.descripcion}</TableCell>
                                            <TableCell>{formatCurrency(ingreso.valor)}</TableCell>
                                            <TableCell>{ingreso.observacion}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <p className="font-medium mb-4">Gastos: {formatCurrency(totalGastosDelDia)}</p>
                        {gastosDelDia.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Concepto</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Observacion</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gastosDelDia.map((gasto) => (
                                        <TableRow key={gasto.id}>
                                            <TableCell>{gasto.descripcion}</TableCell>
                                            <TableCell>{formatCurrency(gasto.valor)}</TableCell>
                                            <TableCell>{gasto.observacion}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Caja</h2>
                    <div className="w-full">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Caja inicial</TableCell>
                                    <TableCell>{formatCurrency(cajaInicial)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Ventas</TableCell>
                                    <TableCell>{formatCurrency(totalVentasDelDia)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cobro</TableCell>
                                    <TableCell>{formatCurrency(dineroCobrado)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gastos</TableCell>
                                    <TableCell>{formatCurrency(totalGastosDelDia * -1)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Ingresos</TableCell>
                                    <TableCell>{formatCurrency(totalIngresosDelDia)}</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Caja final</TableCell>
                                    <TableCell>{formatCurrency(cajaInicial + totalVentasDelDia + dineroCobrado - totalGastosDelDia + totalIngresosDelDia)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

