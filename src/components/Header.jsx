"use client"
import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"
import ItemMenu from "@/components/menu_header/ItemMenu"

export default function Header() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <header>
            <div className="flex gap-4 p-4 h-10 bg-orange-400 justify-center fixed top-0 left-0 w-full items-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)]">
                <button className="absolute left-4" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
                <div className="text-center">Titulo</div>
            </div>
            <nav
                className={`absolute top-10 left-0 w-full bg-orange-600 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                <ul className="p-4 space-y-2">
                    <ItemMenu title="Resumen" />
                    <ItemMenu title="Clientes" />
                    <ItemMenu title="Ventas nuevas" />
                </ul>
            </nav>
        </header>

    )
}
