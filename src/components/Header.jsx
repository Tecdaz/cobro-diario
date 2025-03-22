"use client"
import { useState, useEffect } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useAuth } from "@/contexts/AuthContext"
import { Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/solid"
import ItemMenu from "@/components/menu_header/ItemMenu"
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { title } = useLayout()
    const { user, signOut, isAuthenticated } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    const menuItems = [
        { title: "Inicio", href: "/dashboard" },
        { title: "Resumen", href: "/resumen" },
        { title: "Clientes", href: "/clientes" },
        { title: "Nueva Venta", href: "/nueva_venta" },
        { title: "Ventas de Hoy", href: "/ventas_nuevas" },
        { title: "Renovar Venta", href: "/renovar_venta" },
        { title: "Gestión Gastos", href: "/gestion_gastos" },
        { title: "Ventas otras fechas", href: "/ventas_otra_fecha" },
    ]

    // Cerrar el menú cuando cambia la ruta
    useEffect(() => {
        setIsOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    const handleCloseMenu = () => {
        setIsOpen(false);
    };

    const handleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    const handleSignOut = async () => {
        await signOut();
        setUserMenuOpen(false);
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <header>
            <div className="flex gap-4 p-4 h-10 bg-orange-400 justify-center fixed top-0 left-0 w-full items-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] z-50">
                <button className="absolute left-4" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
                <div className="text-center font-semibold">{title}</div>

                {/* Botón de usuario en la esquina derecha */}
                <button
                    className="absolute right-4"
                    onClick={isAuthenticated ? handleUserMenu : handleLogin}
                >
                    <UserCircleIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Menú de navegación */}
            <nav
                className={`absolute top-10 left-0 w-full bg-orange-500 transition-all duration-300 shadow-lg z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                <ul className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <ItemMenu
                            key={item.href}
                            title={item.title}
                            href={item.href}
                            onClose={handleCloseMenu}
                        />
                    ))}
                </ul>
            </nav>

            {/* Menú de usuario */}
            {isAuthenticated && (
                <div
                    className={`absolute top-10 right-0 w-48 bg-white transition-all duration-300 shadow-lg z-40 rounded-bl-md ${userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                >
                    <div className="p-4 border-b">
                        <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    <ul className="p-2">
                        <li>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}
