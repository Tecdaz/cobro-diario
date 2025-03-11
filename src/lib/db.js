import { createClient } from '@supabase/supabase-js'
import { getEndOfTheDay, getStartOfTheDay } from './utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getTodayCobros() {
    const { data, error } = await supabase
        .from('ventas_para_cobrar')
        .select('*')
        .order('nombre')

    if (error) throw error
    return data
}

export async function getTodayPayments() {
    const { data, error } = await supabase
        .from('cobros_hoy')
        .select('*')
        .order('nombre')

    if (error) throw error
    return data
}

export async function getClientData(clientId) {
    const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('id', clientId)
    if (error) throw error
    return data
}

export async function createClientData(clientData) {
    const { data, error } = await supabase
        .from('cliente')
        .insert(clientData)
        .select();
    console.log("Data", data);
    console.log("Error", error);
    return data
}

export async function createVentaData(ventaData) {
    const { data, error } = await supabase
        .from('venta')
        .insert(ventaData)

    console.log("error", error);
    if (error) throw error
    return data
}

export async function getDataCuotas(idVenta) {
    const { data, error } = await supabase
        .from('venta')
        .select(`
            id,
            valor_cuota,
            cuotas,
            cliente_id,
            cliente(
                nombre,
                telefono,
                direccion
            ),
            abono(
                id,
                valor,
                venta_id    
            ),
            cuota(
                id,
                venta_id,
                cantidad
            )`)
        .eq('id', idVenta)

    if (error) throw error
    return data
}

export async function createAbono(abonoData) {
    const { data, error } = await supabase
        .from('abono')
        .insert(abonoData)

    if (error) throw error
    return data
}

export async function createCuota(cuotaData) {
    // Asegurarse de que todos los campos necesarios estén presentes
    const cuotaCompleta = {
        venta_id: cuotaData.venta_id,
        cantidad: cuotaData.cantidad,
        valor_cuota: cuotaData.valor_cuota,
        total: cuotaData.total
    };

    const { data, error } = await supabase
        .from('cuota')
        .insert(cuotaCompleta)
        .select();

    if (error) throw error;
    return data;
}

export async function createGasto(gastoData) {
    const { data, error } = await supabase
        .from('gastos_ingresos')
        .insert(gastoData)

    if (error) throw error
    return data
}

export async function totalClientes() {
    const { count, error } = await supabase
        .from('cliente')
        .select('id', { count: 'exact' })


    if (error) throw error
    return count
}

export async function clientesHoy() {
    const startOfDay = getStartOfTheDay()
    const endOfDay = getEndOfTheDay()

    const { count, error } = await supabase
        .from('cliente')
        .select('id', { count: 'exact' })
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())

    if (error) throw error
    return count
}

export async function getPaymentsRegistered() {
    const { count, error } = await supabase
        .from('cobros_hoy')
        .select('id', { count: 'exact' })

    if (error) throw error
    return count
}

export async function getClients() {
    const { data, error } = await supabase
        .from('cliente')
        .select('*')

    if (error) throw error
    return data
}

export async function updateClientData(clientId, clientData) {
    const { data, error } = await supabase
        .from('cliente')
        .update(clientData)
        .eq('id', clientId)
        .select();

    if (error) throw error;
    return data;
}

export async function getVentasHoy() {
    const startOfDay = getStartOfTheDay()
    const endOfDay = getEndOfTheDay()

    const { data, error } = await supabase
        .from('venta')
        .select(`
            *,
            cliente (
                nombre,
                telefono,
                direccion,
                documento
            )
        `)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getVentaById(ventaId) {
    const { data, error } = await supabase
        .from('venta')
        .select(`
            *,
            cliente (
                nombre,
                telefono,
                direccion,
                documento
            )
        `)
        .eq('id', ventaId)
        .single();

    if (error) throw error;
    return data;
}

export async function updateVentaData(ventaId, ventaData) {
    const { data, error } = await supabase
        .from('venta')
        .update(ventaData)
        .eq('id', ventaId)
        .select();

    if (error) throw error;
    return data;
}

export async function deleteVenta(ventaId) {
    const { error } = await supabase
        .from('venta')
        .delete()
        .eq('id', ventaId);

    if (error) throw error;
    return true;
}

export async function getResumenDiario() {
    const startOfDay = getStartOfTheDay()
    const endOfDay = getEndOfTheDay()

    // Obtener ventas del día
    const { data: ventasHoy, error: errorVentas } = await supabase
        .from('venta')
        .select('precio, valor_cuota, cuotas')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

    if (errorVentas) throw errorVentas;

    // Obtener cobros del día usando la vista cobros_hoy
    const { data: cobrosHoy, error: errorCobros } = await supabase
        .from('cobros_hoy')
        .select('valor_cuota, saldo');

    if (errorCobros) throw errorCobros;

    // Obtener total de cobros por realizar hoy
    const { data: cobrosPorRealizar, error: errorCobrosPorRealizar } = await supabase
        .from('ventas_para_cobrar')
        .select('*');

    if (errorCobrosPorRealizar) throw errorCobrosPorRealizar;

    // Obtener abonos del día
    const { data: abonosHoy, error: errorAbonos } = await supabase
        .from('abono')
        .select('valor')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

    if (errorAbonos) throw errorAbonos;

    // Obtener cuotas del día
    const { data: cuotasHoy, error: errorCuotas } = await supabase
        .from('cuota')
        .select('total')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

    if (errorCuotas) throw errorCuotas;

    // Obtener gastos del día
    const { data: gastosHoy, error: errorGastos } = await supabase
        .from('gastos_ingresos')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

    if (errorGastos) throw errorGastos;

    // Calcular totales
    const totalVentasProducto = ventasHoy?.reduce((acc, venta) => acc + venta.precio, 0) || 0;
    const totalVentasCuotas = ventasHoy?.reduce((acc, venta) => acc + (venta.valor_cuota * venta.cuotas), 0) || 0;

    // Calcular total de cobros (cuotas + abonos)
    const totalCuotas = cuotasHoy?.reduce((acc, cuota) => acc + cuota.total, 0) || 0;
    const totalAbonos = abonosHoy?.reduce((acc, abono) => acc + abono.valor, 0) || 0;

    const totalGastos = gastosHoy?.filter(gasto => gasto.tipo === 'gasto')
        .reduce((acc, gasto) => acc + gasto.valor, 0) || 0;
    const totalIngresos = gastosHoy?.filter(gasto => gasto.tipo === 'ingreso')
        .reduce((acc, ingreso) => acc + ingreso.valor, 0) || 0;

    return {
        ventasNuevas: ventasHoy?.length || 0,
        totalVentasProducto,
        totalVentasCuotas,
        cobrosRegistrados: (cuotasHoy?.length || 0) + (abonosHoy?.length || 0),
        cobrosPorRealizar: cobrosPorRealizar?.length + (cuotasHoy?.length || 0) + (abonosHoy?.length || 0) || 0,
        totalCobros: totalCuotas + totalAbonos,
        totalGastos,
        totalIngresos,
        cajaFinal: (totalCuotas + totalAbonos + totalIngresos) - (totalGastos + totalVentasProducto)
    };
}

export async function getCajaInicial() {
    const today = getStartOfTheDay();

    // Obtener todos los abonos históricos excepto hoy
    const { data: abonosHistoricos, error: errorAbonos } = await supabase
        .from('abono')
        .select('valor')
        .lt('created_at', today.toISOString());

    if (errorAbonos) throw errorAbonos;

    // Obtener todas las cuotas históricas excepto hoy
    const { data: cuotasHistoricas, error: errorCuotas } = await supabase
        .from('cuota')
        .select('total')
        .lt('created_at', today.toISOString());

    if (errorCuotas) throw errorCuotas;

    // Obtener todos los gastos e ingresos históricos excepto hoy
    const { data: movimientosHistoricos, error: errorMovimientos } = await supabase
        .from('gastos_ingresos')
        .select('*')
        .lt('created_at', today.toISOString());

    if (errorMovimientos) throw errorMovimientos;

    // Obtener todas las ventas históricas excepto hoy
    const { data: ventasHistoricas, error: errorVentas } = await supabase
        .from('venta')
        .select('precio')
        .lt('created_at', today.toISOString());

    if (errorVentas) throw errorVentas;

    // Calcular totales históricos
    const totalCuotasHistoricas = cuotasHistoricas?.reduce((acc, cuota) =>
        acc + cuota.total, 0) || 0;

    const totalAbonosHistoricos = abonosHistoricos?.reduce((acc, abono) =>
        acc + abono.valor, 0) || 0;

    const totalGastosHistoricos = movimientosHistoricos?.filter(mov => mov.tipo === 'gasto')
        .reduce((acc, gasto) => acc + gasto.valor, 0) || 0;

    const totalIngresosHistoricos = movimientosHistoricos?.filter(mov => mov.tipo === 'ingreso')
        .reduce((acc, ingreso) => acc + ingreso.valor, 0) || 0;

    const totalVentasHistoricas = ventasHistoricas?.reduce((acc, venta) =>
        acc + venta.precio, 0) || 0;

    // La caja inicial es la suma de todos los ingresos menos los gastos y ventas
    return (totalCuotasHistoricas + totalAbonosHistoricos + totalIngresosHistoricos) -
        (totalGastosHistoricos + totalVentasHistoricas);
}
