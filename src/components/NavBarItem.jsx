"use client"
import { useLayout } from "@/contexts/LayoutContext"

export default function NavBarItem(props) {
    const { pathName, handleNavigation } = useLayout()
    const { children, href, label } = props

    const handleClick = (e) => {
        e.preventDefault();
        handleNavigation(href);
    }

    const isActive = pathName === href;

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`h-full w-full bg-orange-400 flex flex-col justify-center items-center px-2 ${isActive ? "text-white" : "text-black"}`}
        >
            <div className={`${isActive ? "text-white" : "text-black"}`}>
                {children}
            </div>
            {label && (
                <span className={`text-xs mt-1 font-medium ${isActive ? "text-white" : "text-black"} text-center`}>
                    {label}
                </span>
            )}
        </a>
    )
}
