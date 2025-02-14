import NavBarItem from "./NavBarItem"

export default function NavBar() {
    return (
        <div className="h-16 w-full flex justify-between items-center fixed bottom-0 left-0 
        shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.2)]">
            <NavBarItem />
            <NavBarItem />
            <NavBarItem />
            <NavBarItem />
        </div>
    )
}