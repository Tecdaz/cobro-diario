'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCartera, supabase } from '@/lib/db'

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
    const [cartera, setCartera] = useState({
        id_cartera: null,
        cartera: {
            nombre: null
        }
    })

    // Comprobar si hay una sesión activa al cargar y configurar renovación automática de tokens
    useEffect(() => {
        async function getSession() {
            setLoading(true)
            try {
                // Habilitar la renovación automática de tokens
                await supabase.auth.setSession({
                    refresh_token_threshold: 60, // Renovar cuando falten 60 segundos para expirar
                    autoRefreshToken: true
                });

                const { data: { session }, error } = await supabase.auth.getSession()

                if (session) {
                    setUser(session.user)
                    const carteraData = await getCartera(session.user.id)
                    setCartera(carteraData)
                } else {
                    setUser(null)
                    setCartera({
                        id_cartera: null,
                        cartera: {
                            nombre: null
                        }
                    })
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
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    setUser(session.user)
                    // Establecer la cartera después de iniciar sesión
                    try {
                        const carteraData = await getCartera(session.user.id)
                        setCartera(carteraData)
                    } catch (error) {
                        console.error('Error al obtener la cartera:', error)
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setCartera({
                        id_cartera: null,
                        cartera: {
                            nombre: null
                        }
                    })
                } else if (event === 'TOKEN_REFRESHED') {
                    // Actualizar usuario cuando se renueve el token
                    setUser(session.user)
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
        cartera,
        setCartera
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 