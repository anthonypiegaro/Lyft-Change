import { useEffect, useState } from "react"

const LARGE_BREAKPOINT = 1024

export function useIsLargeScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LARGE_BREAKPOINT}px)`)
    const onChange = () => {
      setIsLargeScreen(window.innerWidth >= LARGE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsLargeScreen(window.innerWidth >= LARGE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isLargeScreen
}
