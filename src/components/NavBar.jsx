import NavBarItem from "./NavBarItem"

export default function NavBar() {
    return (
        <div className="h-16 w-full flex justify-between items-center">
            <NavBarItem />
            <NavBarItem />
            <NavBarItem />
            <NavBarItem />
        </div>
    )
}