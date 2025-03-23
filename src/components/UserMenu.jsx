"use client"

import { useEffect } from "react"

export default function UserMenu({ user, handleSignOut, userMenuOpen, setUserMenuOpen }) {

    useEffect(() => {
        setUserMenuOpen(true)
    }, [])

    return (
        <div
            className={`absolute top-10 right-0 bg-white transition-all duration-300 shadow-lg z-40 rounded-bl-md ${userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
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
    )
}

