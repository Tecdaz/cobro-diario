"use client"
import Link from 'next/link'
import { useLayout } from '@/contexts/LayoutContext'

export default function ItemMenu({ title, href, onClose }) {
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
                className="text-white block p-2 hover:bg-orange-700 rounded transition-colors"
                onClick={handleClick}
            >
                {title}
            </a>
        </li>
    )
}
