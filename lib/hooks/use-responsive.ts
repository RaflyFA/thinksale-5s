"use client"

/**
 * Responsive Hook
 *
 * Custom hook untuk mendeteksi breakpoint dan ukuran layar
 * Membantu dalam membuat komponen yang responsive
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from "react"

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl"

interface UseResponsiveReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  currentBreakpoint: Breakpoint
  isBreakpoint: (breakpoint: Breakpoint) => boolean
}

export function useResponsive(): UseResponsiveReturn {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const breakpointValues = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  }

  const getCurrentBreakpoint = (): Breakpoint => {
    if (windowWidth >= breakpointValues["2xl"]) return "2xl"
    if (windowWidth >= breakpointValues.xl) return "xl"
    if (windowWidth >= breakpointValues.lg) return "lg"
    if (windowWidth >= breakpointValues.md) return "md"
    return "sm"
  }

  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return windowWidth >= breakpointValues[breakpoint]
  }

  return {
    isMobile: windowWidth < breakpointValues.md,
    isTablet: windowWidth >= breakpointValues.md && windowWidth < breakpointValues.lg,
    isDesktop: windowWidth >= breakpointValues.lg,
    currentBreakpoint: getCurrentBreakpoint(),
    isBreakpoint,
  }
}
