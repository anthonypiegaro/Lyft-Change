import { useLayoutEffect, useState } from "react"

const LARGE_BREAKPOINT = 1024

export function useIsLargeScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean | undefined>(undefined)

  useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${LARGE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsLargeScreen(window.innerWidth < LARGE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsLargeScreen(window.innerWidth <LARGE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isLargeScreen
}
