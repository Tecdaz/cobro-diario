import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://zaeatqfktzrnlbcgvihz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZWF0cWZrdHpybmxiY2d2aWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMTYxOTksImV4cCI6MjA1NTU5MjE5OX0.ySxcSiqEwf5iAHpXktPRYBz2paeMjuzNQyjpj_dzpHE')

export async function getTodayCobros() {
    const { data, error } = await supabase
        .from('ventas_para_cobrar')
        .select('*')

    if (error) throw error
    return data
}

export async function getTodayPayments() {
    const { data, error } = await supabase
        .from('cobros_hoy')
        .select('*')

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
    const { data, error } = await supabase
        .from('cuota')
        .insert(cuotaData)

    if (error) throw error
    return data
}

export async function createGasto(gastoData) {
    const { data, error } = await supabase
        .from('gastos_ingresos')
        .insert(gastoData)

    if (error) throw error
    return data
}