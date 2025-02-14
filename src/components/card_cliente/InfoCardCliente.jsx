export default function InfoCardCliente(props) {
    const { title, value } = props
    return (
        <div className="flex gap-1 flex-1">
            <span className="font-semibold">{title}:</span>
            <p>{value}</p>
        </div>
    )
}
