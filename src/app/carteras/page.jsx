"use client"

import { useAuth } from "@/contexts/AuthContext"
import { getCarterasByUser } from "@/lib/db"
import { useEffect, useState } from "react"


export default function Carteras() {

    const [carteras, setCarteras] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, cartera } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Solo ejecutar si el usuario existe
                if (user && user.id) {
                    console.log("Obteniendo carteras para usuario:", user.id)
                    const carterasQuery = await getCarterasByUser(user.id)
                    console.log("Carteras obtenidas:", carterasQuery)
                    setCarteras(carterasQuery || [])
                } else {
                    console.log("Usuario no disponible aún")
                }
            } catch (error) {
                console.error("Error al obtener carteras:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user]) // Dependencia correcta: solo ejecutar cuando user cambie

    // Esperar a que los datos estén disponibles
    if (loading) return <div>Cargando carteras...</div>

    // Acceder a carteras solo cuando existan datos
    console.log("Carteras en el componente:", carteras)

    const defaultCartera = carteras.length > 0
        ? carteras.find(cartera => cartera.default === true)
        : null

    console.log("Cartera por defecto:", defaultCartera)
    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-col">
                <h2>Actual</h2>
                <div className="flex justify-between">
                    <div>{cartera.cartera.nombre}</div>
                    {cartera.id_cartera === defaultCartera.cartera.id ?
                        (<div className="text-gray-500">Principal</div >) :
                        (<div className="text-blue-500">Hacer principal</div>)
                    }
                </div>

            </div>
            <div>
                <h2></h2>
            </div>
        </div>
    )
}