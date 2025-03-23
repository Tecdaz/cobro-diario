import { createClient } from '@supabase/supabase-js'
import { getEndOfTheDay, getStartOfTheDay } from './utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getTodayCobros(user, carteraId) {
    const { data, error } = await supabase
        .from('ventas_para_cobrar')
        .select('*')
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId)
        .order('nombre')

    if (error) throw error
    return data
}

export async function getTodayPayments(user, carteraId) {
    const { data, error } = await supabase
        .from('cobros_hoy')
        .select('*')
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId)
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
    ;
    ;
    return data
}

export async function createVentaData(ventaData) {
    const { data, error } = await supabase
        .from('venta')
        .insert(ventaData)

        ;
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
                venta_id,
                created_at
            ),
            cuota(
                id,
                venta_id,
                cantidad,
                created_at
            ),
            no_pago(
                id,
                id_venta,
                created_at
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

export async function createGasto(data) {
    const { error } = await supabase
        .from('gastos_ingresos')
        .insert({
            valor: data.valor,
            tipo: data.tipo,
            descripcion: data.descripcion,
            observacion: data.observacion,
            cobrador: data.cobrador,
            id_cartera: data.id_cartera
        });

    if (error) throw error;
    return true;
}

export async function totalClientes(user, carteraId) {
    const { count, error } = await supabase
        .from('cliente')
        .select('id', { count: 'exact' })
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId)



    if (error) throw error
    return count
}

export async function clientesHoy(user, carteraId) {
    const startOfDay = getStartOfTheDay()
    const endOfDay = getEndOfTheDay()

    const { count, error } = await supabase
        .from('cliente')
        .select('id', { count: 'exact' })
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId)

    if (error) throw error
    return count
}

export async function getClients(user, carteraId) {
    const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

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
    // Primero obtenemos la información de la venta para saber el cliente_id
    const { data: venta, error: errorVenta } = await supabase
        .from('venta')
        .select('cliente_id')
        .eq('id', ventaId)
        .single();

    if (errorVenta) throw errorVenta;

    // Eliminamos la venta
    const { error } = await supabase
        .from('venta')
        .delete()
        .eq('id', ventaId);

    if (error) throw error;

    // Verificamos si el cliente solo tenía esta venta (es cliente nuevo)
    if (venta.cliente_id) {
        const esClienteNuevo = await verificarClienteNuevo(venta.cliente_id);

        // Si es cliente nuevo, lo eliminamos también
        if (esClienteNuevo) {
            const { error: errorCliente } = await supabase
                .from('cliente')
                .delete()
                .eq('id', venta.cliente_id);

            if (errorCliente) throw errorCliente;
        }
    }

    return true;
}

// Función para verificar si un cliente es nuevo (no tiene otras ventas)
export async function verificarClienteNuevo(clienteId) {
    const { count, error } = await supabase
        .from('venta')
        .select('id', { count: 'exact' })
        .eq('cliente_id', clienteId);

    if (error) throw error;

    // Si no tiene ventas (count = 0), es un cliente nuevo
    // Esta consulta se ejecuta DESPUÉS de eliminar la venta actual
    return count === 0;
}

export async function getResumenDiario(user, carteraId) {
    const startOfDay = getStartOfTheDay()
    const endOfDay = getEndOfTheDay()

    // Obtener ventas del día
    const { data: ventasHoy, error: errorVentas } = await supabase
        .from('venta')
        .select('precio, valor_cuota, cuotas')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

    if (errorVentas) throw errorVentas;

    // Obtener cobros del día usando la vista cobros_hoy
    const { data: cobrosHoy, error: errorCobros } = await supabase
        .from('cobros_hoy')
        .select('valor_cuota, saldo')
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

    if (errorCobros) throw errorCobros;

    // Obtener total de cobros por realizar hoy
    const { data: cobrosPorRealizar, error: errorCobrosPorRealizar } = await supabase
        .from('ventas_para_cobrar')
        .select('*')
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

    if (errorCobrosPorRealizar) throw errorCobrosPorRealizar;

    // Obtener abonos del día
    const { data: abonosHoy, error: errorAbonos } = await supabase
        .from('abono')
        .select('valor, venta(cobrador, id_cartera)')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('venta.cobrador', user.id)
        .eq('venta.id_cartera', carteraId)
        .not('venta', 'is', null)

    if (errorAbonos) throw errorAbonos;

    // Obtener cuotas del día
    const { data: cuotasHoy, error: errorCuotas } = await supabase
        .from('cuota')
        .select('total, venta(cobrador, id_cartera)')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('venta.cobrador', user.id)
        .eq('venta.id_cartera', carteraId)
        .not('venta', 'is', null)

    if (errorCuotas) throw errorCuotas;

    // Obtener gastos del día
    const { data: gastosHoy, error: errorGastos } = await supabase
        .from('gastos_ingresos')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

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

export async function getCajaInicial(user, carteraId) {
    const today = getStartOfTheDay();

    // Obtener todos los abonos históricos excepto hoy
    const { data: abonosHistoricos, error: errorAbonos } = await supabase
        .from('abono')
        .select('valor, venta(cobrador, id_cartera)')
        .lt('created_at', today.toISOString())
        .eq('venta.cobrador', user.id)
        .eq('venta.id_cartera', carteraId)
        .not('venta', 'is', null);

    if (errorAbonos) throw errorAbonos;

    // Obtener todas las cuotas históricas excepto hoy
    const { data: cuotasHistoricas, error: errorCuotas } = await supabase
        .from('cuota')
        .select('total, venta(cobrador, id_cartera)')
        .lt('created_at', today.toISOString())
        .eq('venta.cobrador', user.id)
        .eq('venta.id_cartera', carteraId)
        .not('venta', 'is', null);

    if (errorCuotas) throw errorCuotas;

    // Obtener todos los gastos e ingresos históricos excepto hoy
    const { data: movimientosHistoricos, error: errorMovimientos } = await supabase
        .from('gastos_ingresos')
        .select('*')
        .lt('created_at', today.toISOString())
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);


    if (errorMovimientos) throw errorMovimientos;

    // Obtener todas las ventas históricas excepto hoy
    const { data: ventasHistoricas, error: errorVentas } = await supabase
        .from('venta')
        .select('precio')
        .lt('created_at', today.toISOString())
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

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

export async function getVentasOtrasFechas(user, carteraId) {

    const { data, error } = await supabase
        .from('ventas_otras_fechas')
        .select('*')
        .eq('cobrador', user.id)
        .eq('id_cartera', carteraId);

    ;
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

export async function getCartera(userId) {
    const { data, error } = await supabase
        .from('usuario_cartera')
        .select('id_cartera, cartera(nombre)')
        .eq('id_usuario', userId)
        .eq('default', true)
        .limit(1)
        .single();

    if (error) throw error;

    return data;
}

export async function getCarterasByUser(userId) {
    const { data, error } = await supabase
        .from('usuario_cartera')
        .select('cartera(*), default')
        .eq('id_usuario', userId);

    if (error) throw error;
    return data;
}

export async function setDefaultCartera(userId, carteraId) {
    // Primero, establece todas las carteras del usuario como no predeterminadas
    const { error: resetError } = await supabase
        .from('usuario_cartera')
        .update({ default: false })
        .eq('id_usuario', userId);

    if (resetError) throw resetError;

    // Luego, establece la cartera seleccionada como predeterminada
    const { error: updateError } = await supabase
        .from('usuario_cartera')
        .update({ default: true })
        .eq('id_usuario', userId)
        .eq('id_cartera', carteraId);

    if (updateError) throw updateError;

    return { success: true };
}