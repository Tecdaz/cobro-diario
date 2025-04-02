"use client"

import { createContext, useContext, useState, useEffect } from 'react'

import { getCartera } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [cartera, setCartera] = useState({
        id_cartera: null,
        cartera: {
            nombre: null,
        }
    })
    const [loading, setLoading] = useState(true)

    const supabase = createClient()
    useEffect(() => {
        setLoading(true)
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        fetchUser()
        setLoading(false)
    }, [])

    useEffect(() => {
        setLoading(true)
        const fetchCartera = async () => {
            if (user) {
                const cartera = await getCartera(user)
                setCartera(cartera)
            }
        }
        fetchCartera()
        setLoading(false)
    }, [user])

    return (
        <AuthContext.Provider value={{ user, cartera, loading, setCartera, setUser, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)


