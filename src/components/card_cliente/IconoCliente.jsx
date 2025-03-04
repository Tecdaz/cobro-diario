export default function IconoCliente(props) {
    const { status, onClick } = props

    let color = "bg-black"
    if (status === "ok") {
        color = "bg-green-400"
    }
    if (status === "warning") {
        color = "bg-yellow-400"
    }
    if (status === "bad") {
        color = "bg-red-400"
    }
    return (
        <div onClick={onClick} className={`h-12 w-12 ${color}`}>X</div>
    )
}
