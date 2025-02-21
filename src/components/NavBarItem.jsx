"use client"
import { useLayout } from "@/contexts/LayoutContext"

export default function NavBarItem(props) {
    const { pathName } = useLayout()


    const { children, href } = props
    return (
        <a href={href} className={`h-full w-full bg-orange-400 flex justify-center items-center ${pathName === href ? "text-white" : "text-black"}`}>
            {children}
        </a>
    )
}
