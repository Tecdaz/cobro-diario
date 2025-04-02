import Header from "@/components/Header"
import NavigationModal from "@/components/NavigationModal"
import NavBar from "@/components/NavBar"

export default function AppLayout({ children }) {
    return (
        <>
            <Header />
            <NavigationModal />
            <main className="overflow-auto mt-14 mb-16 flex-1">{children}</main>
            <NavBar />
        </>
    )
}