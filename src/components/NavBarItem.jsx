"use client"
import { useLayout } from "@/contexts/LayoutContext"

export default function NavBarItem(props) {
    const { pathName, handleNavigation } = useLayout()
    const { children, href } = props

    const handleClick = (e) => {
        e.preventDefault();
        handleNavigation(href);
    }

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`h-full w-full bg-orange-400 flex justify-center items-center ${pathName === href ? "text-white" : "text-black"}`}
        >
            {children}
        </a>
    )
}
