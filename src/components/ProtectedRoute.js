'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    // Mientras verifica la autenticación, mostrar un indicador de carga
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Si el usuario está autenticado, mostrar los hijos
    return user ? children : null
} 