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
    const [carteraLoading, setCarteraLoading] = useState(false)
    const router = useRouter()
    const [cartera, setCartera] = useState({
        id_cartera: null,
        cartera: {
            nombre: null
        }
    })

    // Efecto para cargar la cartera cuando cambia el usuario
    useEffect(() => {
        async function loadCartera() {
            if (!user) return;

            setCarteraLoading(true);
            try {
                console.log('[AuthContext] Obteniendo datos de cartera para usuario:', user.id);
                const carteraData = await getCartera(user.id);
                console.log('[AuthContext] Datos de cartera obtenidos:', carteraData);
                setCartera(carteraData);
            } catch (error) {
                console.error('[AuthContext] Error al obtener cartera:', error);
                setCartera({
                    id_cartera: null,
                    cartera: { nombre: 'Error al obtener cartera' }
                });
            } finally {
                setCarteraLoading(false);
            }
        }

        if (user) {
            loadCartera();
        }
    }, [user]);

    // Comprobar si hay una sesión activa al cargar
    useEffect(() => {
        async function getSession() {
            setLoading(true);
            try {
                console.log('[AuthContext] Iniciando obtención de sesión');

                // Simplemente obtener la sesión
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log('[AuthContext] Resultado getSession:', session ? 'Sesión encontrada' : 'Sin sesión', error ? `Error: ${error.message}` : 'Sin errores');

                if (session) {
                    setUser(session.user);
                } else {
                    console.log('[AuthContext] No hay sesión activa');
                    setUser(null);
                    setCartera({
                        id_cartera: null,
                        cartera: { nombre: null }
                    });
                }
            } catch (error) {
                console.error('[AuthContext] Error crítico al obtener la sesión:', error);
                setUser(null);
            } finally {
                setLoading(false);
                console.log('[AuthContext] Estado de carga finalizado');
            }
        }

        getSession();

        // Configurar oyente para cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('[AuthContext] Evento de autenticación:', event, session ? 'Con sesión' : 'Sin sesión');

                if (event === 'SIGNED_IN' && session) {
                    setUser(session.user);
                } else if (event === 'SIGNED_OUT') {
                    console.log('[AuthContext] Usuario ha cerrado sesión');
                    setUser(null);
                    setCartera({
                        id_cartera: null,
                        cartera: { nombre: null }
                    });
                }
            }
        );

        // Limpiar la suscripción
        return () => {
            subscription?.unsubscribe();
        }
    }, []);

    // Función para cerrar sesión
    async function signOut() {
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    // Valor a proporcionar en el contexto
    const value = {
        user,
        loading,
        carteraLoading,
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