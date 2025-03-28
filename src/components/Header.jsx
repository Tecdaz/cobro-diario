"use client"
import { useState, useEffect } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useAuth } from "@/contexts/AuthContext"
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    HomeIcon,
    ChartBarIcon,
    UsersIcon,
    ShoppingCartIcon,
    CalendarIcon,
    ArrowPathIcon,
    BanknotesIcon,
    ClockIcon,
    ReceiptRefundIcon
} from "@heroicons/react/24/solid"
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
        { title: "Inicio", href: "/dashboard", icon: <HomeIcon className="h-5 w-5" /> },
        { title: "Resumen", href: "/resumen", icon: <ChartBarIcon className="h-5 w-5" /> },
        { title: "Clientes", href: "/clientes", icon: <UsersIcon className="h-5 w-5" /> },
        { title: "Nueva Venta", href: "/nueva_venta", icon: <ShoppingCartIcon className="h-5 w-5" /> },
        { title: "Ventas de Hoy", href: "/ventas_nuevas", icon: <CalendarIcon className="h-5 w-5" /> },
        { title: "Renovar Venta", href: "/renovar_venta", icon: <ArrowPathIcon className="h-5 w-5" /> },
        { title: "Gestion Caja", href: "/gestion_gastos", icon: <BanknotesIcon className="h-5 w-5" /> },
        { title: "Ventas otras fechas", href: "/ventas_otra_fecha", icon: <ClockIcon className="h-5 w-5" /> },
        { title: "Historial de Pagos", href: "/pagos", icon: <ReceiptRefundIcon className="h-5 w-5" /> },
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
            <div className="flex gap-4 p-4 h-14 bg-orange-400 justify-center fixed top-0 left-0 w-full items-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] z-50">
                {/* Contenedor con ancho máximo */}
                <div className="mx-auto w-full max-w-[768px] flex items-center justify-center relative">
                    <button className="absolute left-0" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
                    </button>
                    <div className="text-center font-semibold text-lg">{title}</div>

                    {/* Botón de usuario en la esquina derecha */}
                    <button
                        className="absolute right-0"
                        onClick={isAuthenticated ? handleUserMenu : handleLogin}
                    >
                        <UserCircleIcon className="h-7 w-7" />
                    </button>
                </div>
            </div>

            {/* Menú de navegación */}
            <nav
                className={`fixed top-14 left-0 w-full bg-orange-500 transition-all duration-300 shadow-lg z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                <div className="mx-auto w-full max-w-[768px]">
                    <ul className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <ItemMenu
                                key={item.href}
                                title={item.title}
                                href={item.href}
                                icon={item.icon}
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
