"use client"

import { usePathname, useRouter } from "next/navigation"
import { createContext, useContext, useState } from "react"

const LayoutContext = createContext()

export const LayoutProvider = ({ children }) => {
    const pathName = usePathname()
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [showNavModal, setShowNavModal] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState(null)
    const [needsConfirmation, setNeedsConfirmation] = useState(false)

    const handleTitleChange = (newTitle) => {
        setTitle(newTitle)
    }

    const handleNavigation = (href) => {
        if (needsConfirmation) {
            setPendingNavigation(href)
            setShowNavModal(true)
        } else {
            router.push(href)
        }
    }

    const confirmNavigation = () => {
        if (pendingNavigation) {
            router.push(pendingNavigation)
        }
        setShowNavModal(false)
        setPendingNavigation(null)
    }

    const cancelNavigation = () => {
        setShowNavModal(false)
        setPendingNavigation(null)
    }

    const setRequireConfirmation = (value) => {
        setNeedsConfirmation(value)
    }

    return (
        <LayoutContext.Provider value={{
            title,
            handleTitleChange,
            pathName,
            handleNavigation,
            confirmNavigation,
            cancelNavigation,
            showNavModal,
            setRequireConfirmation,
            needsConfirmation
        }}>
            {children}
        </LayoutContext.Provider>
    )
}

export const useLayout = () => useContext(LayoutContext);