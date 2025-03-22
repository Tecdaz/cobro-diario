'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import NavigationModal from '@/components/NavigationModal'
import NavBar from '@/components/NavBar'

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register']

export default function RouteProtector({ children }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isPublicRoute, setIsPublicRoute] = useState(false)

    useEffect(() => {
        // Verificar si la ruta actual es pública
        const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
        setIsPublicRoute(isPublic)

        // Si no está cargando, verificar autenticación
        if (!loading) {
            if (!user && !isPublic) {
                // No está autenticado y no es una ruta pública, redirigir a login
                router.push('/login')
            } else if (user && isPublic) {
                // Está autenticado pero está en una ruta pública (login/register), redirigir a dashboard
                router.push('/dashboard')
            }
        }
    }, [user, loading, pathname, router])

    // Mostrar indicador de carga mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Si es una ruta pública o el usuario está autenticado para una ruta protegida
    if (isPublicRoute || (user && !isPublicRoute)) {
        if (isPublicRoute) {
            // Para rutas públicas (login/register), mostrar solo el contenido sin layout
            return children
        } else {
            // Para rutas protegidas, mostrar el layout completo
            return (
                <>
                    <Header />
                    <NavigationModal />
                    <main className="overflow-auto mt-10 mb-16 flex-1">{children}</main>
                    <NavBar />
                </>
            )
        }
    }

    // Mientras se redirecciona, mostrar indicador de carga
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
} 