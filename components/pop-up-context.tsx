"use client"

import { createContext, ReactNode, useContext, useState } from "react"

import {
  Card,
  CardContent
} from "@/components/ui/card"

type PopupContextType = {
  showPopup: (content: ReactNode) => void
  hidePopup: () => void
}

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popupContent, setPopupContent] = useState<ReactNode | null>(null)

  const showPopup = (content: ReactNode) => setPopupContent(content)
  const hidePopup = () => setPopupContent(null)

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popupContent && (
        <div
          className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/50 z-50 flex justify-center items-center"
          onClick={hidePopup}
        >
          <Card>
            <CardContent>
              {popupContent}
            </CardContent>
          </Card>
        </div>
      )}
    </PopupContext.Provider>
  )
}

export const usePopup = () => {
  const context = useContext(PopupContext)

  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider")
  }

  return context
}
