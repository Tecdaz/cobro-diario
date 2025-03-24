export default function InfoCardCliente(props) {
    const { title, value, onClick } = props

    // Si es un teléfono, hacerlo clickeable
    if (title === "Teléfono" && value) {
        return (
            <div className="flex gap-1 justify-between w-full">
                <span className="font-semibold">{title}:</span>
                <a
                    href={`tel:${value}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={(e) => onClick && onClick(e, title, value)}
                >
                    {value}
                </a>
            </div>
        )
    }

    // Si es una dirección, hacerla clickeable para abrir en mapas
    if (title === "Dirección" && value) {
        return (
            <div className="flex gap-1 justify-between w-full">
                <span className="font-semibold">{title}:</span>
                <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(value)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={(e) => onClick && onClick(e, title, value)}
                >
                    {value}
                </a>
            </div>
        )
    }

    // Renderizado normal para otros tipos
    return (
        <div className="flex gap-1 justify-between w-full">
            <span className="font-semibold">{title}:</span>
            <p>{value}</p>
        </div>
    )
}
