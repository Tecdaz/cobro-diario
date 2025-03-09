import Link from 'next/link'

export default function ItemMenu({ title, href, onClose }) {
    const handleClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <li>
            <Link
                href={href}
                className="text-white block p-2 hover:bg-orange-700 rounded transition-colors"
                onClick={handleClick}
            >
                {title}
            </Link>
        </li>
    )
}
