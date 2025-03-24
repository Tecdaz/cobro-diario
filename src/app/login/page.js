'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { user } = useAuth()

    // Si el usuario ya está autenticado, redirigir al dashboard
    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        } else {
            // Cargar el último correo utilizado si existe
            const savedEmail = localStorage.getItem('lastUserEmail')
            if (savedEmail) {
                setEmail(savedEmail)
            }
        }
    }, [user, router])

    async function handleSignIn(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Guardar el correo en localStorage para futuros inicios de sesión
            localStorage.setItem('lastUserEmail', email)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Credenciales inválidas. Por favor verifique su correo y contraseña.')
                } else if (error.message.includes('Invalid refresh token')) {
                    // Manejo específico para error de token de refresco
                    console.error('Error de token de refresco:', error)
                    // Intentar limpiar la sesión
                    await supabase.auth.signOut()
                    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.')
                } else {
                    throw error
                }
            }

            // Redireccionar al usuario a la página principal después del inicio de sesión exitoso
            router.push('/dashboard')
        } catch (error) {
            console.error('Error de autenticación:', error)
            setError(error.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Cobro Diario</CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder al sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@ejemplo.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 