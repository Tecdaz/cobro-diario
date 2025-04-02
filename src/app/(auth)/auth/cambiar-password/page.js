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
import { useAuth } from '@/contexts/auth-context'

export default function CambiarPassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { user, isAuthenticated } = useAuth()

    // Verificar que el usuario esté autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    async function handleCambiarPassword(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        // Validar que las contraseñas nuevas coincidan
        if (newPassword !== confirmNewPassword) {
            setError('Las contraseñas nuevas no coinciden')
            setLoading(false)
            return
        }

        // Validar que la contraseña tenga al menos 6 caracteres
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            // Primero verificamos la contraseña actual iniciando sesión
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })

            if (signInError) {
                throw new Error('La contraseña actual es incorrecta')
            }

            // Si la contraseña actual es correcta, proceder a actualizar
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                throw error
            }

            // Limpiar campos
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')

            setMessage('Contraseña actualizada correctamente')
        } catch (error) {
            console.error('Error al cambiar contraseña:', error)
            setError(error.message || 'Error al cambiar contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Cambiar Contraseña</CardTitle>
                    <CardDescription>
                        Actualiza la contraseña de tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCambiarPassword} className="space-y-4">
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
                            <Label htmlFor="currentPassword">Contraseña actual</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva contraseña</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
                            <Input
                                id="confirmNewPassword"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
                        Volver al dashboard
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
} 