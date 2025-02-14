export default function NavBarItem(props) {
    const { Icon } = props
    return (
        <div className="h-full w-full bg-orange-400 flex justify-center items-center">
            <Icon className="h-12 w-12" />
        </div>
    )
}
