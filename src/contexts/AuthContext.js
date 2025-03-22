'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/db'

// Crear el contexto de autenticación
const AuthContext = createContext()

// Hook personalizado para usar el contexto
export function useAuth() {
    return useContext(AuthContext)
}

// Proveedor del contexto
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Comprobar si hay una sesión activa al cargar
    useEffect(() => {
        async function getSession() {
            setLoading(true)
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (session) {
                    setUser(session.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Error al obtener la sesión:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getSession()

        // Configurar oyente para cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    setUser(session.user)
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                }
            }
        )

        // Limpiar la suscripción
        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    // Función para cerrar sesión
    async function signOut() {
        try {
            await supabase.auth.signOut()
            router.push('/login')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    // Valor a proporcionar en el contexto
    const value = {
        user,
        loading,
        signOut,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 