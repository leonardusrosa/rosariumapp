import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // Increased to capture more devices as mobile

export function useIsMobile() {
  // Initialize with a sensible default based on common mobile screen width
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth
      const isMobileDevice = width < MOBILE_BREAKPOINT || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }

    // Check immediately
    checkIsMobile()

    // Set up listeners for both resize and orientation change
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const orientationMql = window.matchMedia('(orientation: portrait)')
    
    mql.addEventListener("change", checkIsMobile)
    orientationMql.addEventListener("change", checkIsMobile)
    window.addEventListener("resize", checkIsMobile)
    
    return () => {
      mql.removeEventListener("change", checkIsMobile)
      orientationMql.removeEventListener("change", checkIsMobile)
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}
