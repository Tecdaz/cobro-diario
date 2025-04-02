'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { getCartera, checkReporteDelDia } from '@/lib/db'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        throw new Error(error.message)
    }

    // Verificar si el usuario tiene un resumen hoy
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const cartera = await getCartera(user)
        const resumenHoy = await checkReporteDelDia(user, cartera.id_cartera)

        if (resumenHoy) {
            throw new Error('Ya tienes un resumen del dia, no puedes iniciar sesión')
        }
    } catch (error) {
        throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}