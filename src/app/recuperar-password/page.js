'use client'

import { useState } from 'react'
import { supabase } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function RecuperarPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    async function handleRecuperarPassword(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            // Guardar el correo en localStorage para futuros inicios de sesión
            localStorage.setItem('lastUserEmail', email)

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/actualizar-password`,
            })

            if (error) {
                throw error
            }

            setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.')
        } catch (error) {
            console.error('Error al solicitar recuperación de contraseña:', error)
            setError(error.message || 'Error al solicitar recuperación de contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
                    <CardDescription>
                        Ingresa tu correo electrónico para recuperar tu contraseña
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRecuperarPassword} className="space-y-4">
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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