export default function InfoCardCliente(props) {
    const { title, value } = props
    return (
        <div className="flex gap-1 justify-between w-full">
            <span className="font-semibold">{title}:</span>
            <p>{value}</p>
        </div>
    )
}
