import { Info, X } from 'lucide-react';

export default function IconoCliente(props) {
    const { status, onClick, isOpen } = props

    let bgColor = "bg-gray-100"
    let textColor = "text-gray-600"

    if (status === "ok") {
        bgColor = "bg-green-100"
        textColor = "text-green-600"
    }
    if (status === "warning") {
        bgColor = "bg-yellow-100"
        textColor = "text-yellow-600"
    }
    if (status === "bad") {
        bgColor = "bg-red-100"
        textColor = "text-red-600"
    }

    return (
        <div
            onClick={onClick}
            className={`w-8 h-8 ${bgColor} ${textColor} rounded flex items-center justify-center cursor-pointer hover:bg-opacity-75 transition-colors`}
        >
            {isOpen ? <X size={18} /> : <Info size={18} />}
        </div>
    )
}
