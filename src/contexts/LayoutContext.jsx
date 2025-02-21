"use client"

import { usePathname } from "next/navigation"
import { createContext, useContext, useState } from "react"

const LayoutContext = createContext()



export const LayoutProvider = ({ children }) => {

    const pathName = usePathname()
    const [title, setTitle] = useState("")

    const handleTitleChange = (newTitle) => {
        setTitle(newTitle)
    }

    return (
        <LayoutContext.Provider value={{ title, handleTitleChange, pathName }}>
            {children}
        </LayoutContext.Provider>
    )
}

export const useLayout = () => useContext(LayoutContext);