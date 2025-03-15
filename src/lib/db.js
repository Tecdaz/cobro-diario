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
            created_at,
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
            ),
            no_pago(
                id_venta
            )`
        )
        .eq('id', idVenta)

    if (error) throw error
    return data
}

export async function deleteSiguienteDia(ventaId) {
    const { error } = await supabase
        .from('siguiente_dia')
        .delete()
        .eq('venta_id', ventaId);

    if (error) throw error;
    return true;
}

export async function createAbono(abonoData) {
    // Primero eliminamos cualquier registro en siguiente_dia
    await deleteSiguienteDia(abonoData.venta_id);

    const { data, error } = await supabase
        .from('abono')
        .insert(abonoData)

    if (error) throw error
    return data
}

export async function createCuota(cuotaData) {
    // Primero eliminamos cualquier registro en siguiente_dia
    await deleteSiguienteDia(cuotaData.venta_id);

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

export async function createSiguienteDia(data) {
    const { error } = await supabase
        .from('siguiente_dia')
        .insert({
            venta_id: data.venta_id
        });

    if (error) throw error;
    return true;
}

export async function getVentasOtrasFechas() {
    // Primero obtenemos los IDs de las ventas que están en cobros_hoy y ventas_para_cobrar
    const { data: ventasExcluidas, error: errorExcluidas } = await supabase
        .from('ventas_para_cobrar')
        .select('id');

    const { data: cobrosExcluidos, error: errorCobros } = await supabase
        .from('cobros_hoy')
        .select('id');

    if (errorExcluidas) throw errorExcluidas;
    if (errorCobros) throw errorCobros;

    // Combinamos los IDs a excluir
    const idsExcluidos = [
        ...(ventasExcluidas || []).map(v => v.id),
        ...(cobrosExcluidos || []).map(c => c.id)
    ];

    console.log("Ids Excluidos", idsExcluidos);

    // Luego obtenemos todas las ventas que no están en esa lista
    const { data, error } = await supabase
        .from('ventas_otras_fechas')
        .select(`
            *,
            cliente (
                nombre,
                telefono,
                direccion,
                documento
            )
        `);

    console.log("Error", error);
    if (error) throw error;
    return data;
}

export async function createNoPago(ventaId) {
    const { error } = await supabase
        .from('no_pago')
        .insert({
            id_venta: ventaId
        });

    if (error) throw error;
    return true;
}

export async function getNoPagosCount(ventaId) {
    const { count, error } = await supabase
        .from('no_pago')
        .select('id', { count: 'exact' })
        .eq('id', ventaId);

    if (error) throw error;
    return count;
}

export async function getSaldos(ventaId) {
    const { data, error } = await supabase
        .from('saldos')
        .select('*')
        .eq('id', ventaId);

    if (error) throw error;
    return data;
}
