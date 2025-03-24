"use client"
import Link from 'next/link'
import { useLayout } from '@/contexts/LayoutContext'

export default function ItemMenu({ title, href, icon, onClose }) {
    const { handleNavigation } = useLayout();

    const handleClick = (e) => {
        e.preventDefault();
        if (onClose) {
            onClose();
        }
        handleNavigation(href);
    };

    return (
        <li>
            <a
                href={href}
                className="text-white flex items-center gap-3 p-2 hover:bg-orange-700 rounded transition-colors"
                onClick={handleClick}
            >
                {icon && <div className="text-orange-100">{icon}</div>}
                <span>{title}</span>
            </a>
        </li>
    )
}
