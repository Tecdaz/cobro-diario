import NavBarItem from "@/components/NavBarItem"
import {
    HomeIcon,
    ShoppingCartIcon,
    BanknotesIcon,
    ChartBarIcon
} from "@heroicons/react/24/solid"

export default function NavBar() {
    return (
        <div className="h-16 w-full fixed bottom-0 left-0 shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.2)] bg-orange-400 z-50">
            <div className="mx-auto w-full max-w-[768px] h-full flex justify-between items-center px-2">
                <NavBarItem href="/dashboard" label="Inicio">
                    <HomeIcon className="h-7 w-7" />
                </NavBarItem>
                <NavBarItem href="/nueva_venta" label="Nueva Venta">
                    <ShoppingCartIcon className="h-7 w-7" />
                </NavBarItem>
                <NavBarItem href="/gestion_gastos" label="Gastos">
                    <BanknotesIcon className="h-7 w-7" />
                </NavBarItem>
                <NavBarItem href="/resumen" label="Resumen">
                    <ChartBarIcon className="h-7 w-7" />
                </NavBarItem>
            </div>
        </div>
    )
}