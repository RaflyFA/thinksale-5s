"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      className={`fixed bottom-24 sm:bottom-28 right-4 sm:right-6 lg:right-8 z-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-opacity duration-300 p-3 sm:p-4 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={scrollToTop}
      size="icon"
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
    </Button>
  )
}
