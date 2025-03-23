"use client"

import { useAuth } from "@/contexts/AuthContext"
import { getCarterasByUser, setDefaultCartera } from "@/lib/db"
import { useEffect, useState } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useRouter } from "next/navigation"


export default function Carteras() {

    const router = useRouter()
    const [carteras, setCarteras] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, cartera, setCartera } = useAuth()
    const { handleTitleChange } = useLayout()

    useEffect(() => {
        handleTitleChange('Carteras')
    }, [handleTitleChange])

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


    const handlePick = (cartera) => {
        return () => { // Retornamos una función (callback) para onClick
            console.log("Cartera seleccionada:", cartera)
            setCartera(cartera)
            // Actualiza y recarga la página actual
            router.refresh()
            // O navega a otra página si prefieres
            // router.push('/dashboard')
        }

    }

    const handlePrincipal = async (id_cartera) => {
        try {
            await setDefaultCartera(user.id, id_cartera)
            // Actualizar el estado local de carteras
            const updatedCarteras = carteras.map(cartera => {
                if (cartera.cartera.id === id_cartera) {
                    return { ...cartera, default: true };
                } else {
                    return { ...cartera, default: false };
                }
            });

            setCarteras(updatedCarteras);
        }
        catch (error) {
            console.error("Error al cambiar cartera", error)
        }
    }

    // Esperar a que los datos estén disponibles
    if (loading) return <div>Cargando carteras...</div>

    // Acceder a carteras solo cuando existan datos
    console.log("Carteras en el componente:", carteras)

    const defaultCartera = carteras.length > 0
        ? carteras.find(cartera => cartera.default === true)
        : null

    console.log("Cartera por defecto:", defaultCartera)
    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col">
                <h2>Actual</h2>
                <div className="flex justify-between">
                    <div className="font-semibold">{cartera.cartera.nombre}</div>
                    {cartera.id_cartera === defaultCartera.cartera.id ?
                        (<div className="text-gray-500">Principal</div >) :
                        (<div className="text-blue-500" onClick={() => handlePrincipal(cartera.id_cartera)}>Hacer principal</div>)
                    }
                </div>

            </div>
            {
                (<div>
                    <h2>Otras</h2>
                    {carteras.filter(
                        (carteraF) =>
                            carteraF.cartera.id !== cartera.id_cartera
                    ).map((cartera) => (
                        <div key={cartera.cartera.id} className="flex justify-between">
                            <div><span className="font-semibold">{cartera.cartera.nombre}</span> {cartera.cartera.id === defaultCartera.cartera.id && "(Principal)"}</div>
                            <div className="text-blue-500" onClick={handlePick({ id_cartera: cartera.cartera.id, cartera: { nombre: cartera.cartera.nombre } })}>Seleccionar</div>
                        </div>
                    ))}
                </div>)
            }

        </div>
    )
}