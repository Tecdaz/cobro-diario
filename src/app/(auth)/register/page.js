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

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { user } = useAuth()

    // Si el usuario ya está autenticado, redirigir al dashboard
    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user, router])

    async function handleSignUp(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            setSuccess(true)
            // Redireccionar al usuario después de 2 segundos
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error) {
            setError(error.message || 'Error al registrar usuario')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Cobro Diario</CardTitle>
                    <CardDescription>
                        Crea una nueva cuenta para acceder al sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <Alert className="bg-green-100 border-green-500">
                            <AlertDescription className="text-green-800">
                                Usuario registrado con éxito. Serás redirigido a la página de inicio de sesión.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
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
                                {loading ? 'Registrando...' : 'Registrarse'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Iniciar sesión
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
} 