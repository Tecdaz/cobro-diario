"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function UserMenu({ user, handleSignOut, userMenuOpen, setUserMenuOpen }) {
    const menuRef = useRef(null);
    const { cartera } = useAuth()

    useEffect(() => {
        setUserMenuOpen(true)
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setUserMenuOpen]);

    if (!userMenuOpen) return null;

    return (
        <div className="fixed top-14 right-0 w-full z-40">
            <div className="mx-auto w-full max-w-[768px] flex justify-end">
                <div
                    ref={menuRef}
                    className={`bg-white shadow-lg rounded-bl-md mr-2 ${userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                >
                    <div className="flex justify-between p-4 border-b text-sm font-medium">
                        <p className="">{cartera.cartera.nombre}</p>
                        <Link href={'/carteras'} className="text-blue-500 ml-4">Cambiar</Link>
                    </div>
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
            </div>
        </div>
    )
}

