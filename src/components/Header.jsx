"use client"
import { useState, useEffect } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useAuth } from "@/contexts/AuthContext"
import { Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/solid"
import ItemMenu from "@/components/menu_header/ItemMenu"
import { usePathname, useRouter } from 'next/navigation'
import UserMenu from "@/components/UserMenu"

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
        { title: "Historial de Pagos", href: "/pagos" },
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
        <header className="w-full">
            {/* Barra superior del header */}
            <div className="flex gap-4 p-4 h-10 bg-orange-400 justify-center fixed top-0 left-0 w-full items-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] z-50">
                {/* Contenedor con ancho máximo */}
                <div className="mx-auto w-full max-w-[768px] flex items-center justify-center relative">
                    <button className="absolute left-0" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                    <div className="text-center font-semibold">{title}</div>

                    {/* Botón de usuario en la esquina derecha */}
                    <button
                        className="absolute right-0"
                        onClick={isAuthenticated ? handleUserMenu : handleLogin}
                    >
                        <UserCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Menú de navegación */}
            <nav
                className={`fixed top-10 left-0 w-full bg-orange-500 transition-all duration-300 shadow-lg z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                <div className="mx-auto w-full max-w-[768px]">
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
                </div>
            </nav>

            {/* Menú de usuario */}
            {isAuthenticated && (
                <UserMenu user={user} handleSignOut={handleSignOut} userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen} />
            )}
        </header>
    )
}
