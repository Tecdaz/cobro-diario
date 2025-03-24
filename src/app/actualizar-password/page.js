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

export default function ActualizarPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { user } = useAuth()

    // Verificar si hay un evento de recuperación de contraseña
    useEffect(() => {
        const handleAuthStateChange = async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                // El usuario está en modo de recuperación de contraseña
                setMessage('Puedes actualizar tu contraseña ahora')
            }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    async function handleActualizarPassword(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        // Validar que la contraseña tenga al menos 6 caracteres
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                throw error
            }

            setMessage('Contraseña actualizada correctamente')
            // Redirigir al usuario al dashboard después de 2 segundos
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (error) {
            console.error('Error al actualizar contraseña:', error)
            setError(error.message || 'Error al actualizar contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Actualizar Contraseña</CardTitle>
                    <CardDescription>
                        Ingresa tu nueva contraseña
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleActualizarPassword} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {message && (
                            <Alert>
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login" className="text-sm text-blue-500 hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
} 