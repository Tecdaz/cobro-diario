'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { checkReporteDelDia, getCartera } from '@/lib/db'
import { login } from './actions'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const supabase = createClient()

    useEffect(() => {
        const savedEmail = localStorage.getItem('lastUserEmail')
        if (savedEmail) {
            setEmail(savedEmail)
        }
    }, [])

    async function handleSignIn(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            localStorage.setItem('lastUserEmail', email)

            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)

            try {
                await login(formData)
            } catch (error) {
                console.error('Error al iniciar sesión:', error)
                setError(error.message || 'Error al iniciar sesión')
                setLoading(false)
                return
            }

            const { user } = await supabase.auth.getUser()

            if (!user) {
                setError('No se encontró un usuario. Por favor, inicie sesión nuevamente.')
                setLoading(false)
                return
            }



            // Obtener la cartera del usuario
            const carteraData = await getCartera(user.id)
            if (!carteraData?.id_cartera) {
                throw new Error('No se encontró una cartera asociada a su usuario.')
            }

            // Verificar si existe un reporte del día
            const existeReporte = await checkReporteDelDia(user.id, carteraData.id_cartera)
            if (existeReporte) {
                await supabase.auth.signOut()
                throw new Error('Ya has registrado un reporte para hoy. No puedes acceder al sistema nuevamente.')
            }

            // Solo si no hay reporte, permitir el acceso
            if (!existeReporte) {
                router.push('/dashboard')
            }

        } catch (error) {
            console.error('Error de autenticación:', error)
            setError(error.message || 'Error al iniciar sesión')
            if (error.message.includes('Ya has registrado un reporte')) {
                await supabase.auth.signOut()
            }
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