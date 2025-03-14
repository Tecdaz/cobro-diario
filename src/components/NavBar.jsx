import NavBarItem from "@/components/NavBarItem"
import { RectangleStackIcon, UserPlusIcon, ScaleIcon, PresentationChartBarIcon } from "@heroicons/react/24/solid"

export default function NavBar() {
    return (
        <div className="h-16 w-full flex justify-between items-center fixed bottom-0 left-0 
        shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.2)]">
            <NavBarItem href="/" >
                <RectangleStackIcon className="h-12 w-12" />
            </NavBarItem>
            <NavBarItem href="/nueva_venta" >
                <UserPlusIcon className="h-12 w-12" />
            </NavBarItem>
            <NavBarItem href="/gestion_gastos">
                <ScaleIcon className="h-12 w-12" />
            </NavBarItem>
            <NavBarItem href="/resumen">
                <PresentationChartBarIcon className="h-12 w-12" />
            </NavBarItem>
        </div>
    )
}