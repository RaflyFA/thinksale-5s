// components/layout/header.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth/auth-context"
import { useCart } from "@/lib/cart/cart-context"
import { cn } from "@/lib/utils/cn"

interface HeaderProps {
  searchTerm?: string
  onSearchChange?: (value: string) => void
  cartItemCount?: number
  className?: string
}

export default function Header({ searchTerm = "", onSearchChange, className, cartItemCount }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const { getTotalItems } = useCart()
  const router = useRouter()

  const handleCartClick = () => {
    if (!user) {
      router.push("/login?redirect=/keranjang")
    } else {
      router.push("/keranjang")
    }
  }

  const handleProfileClick = () => {
    if (!user) {
      // Jika belum login, arahkan langsung ke halaman login
      router.push("/login")
    } else {
      router.push("/profil")
    }
  }

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev)
  }

  // Focus input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus()
    }
  }, [isMobileSearchOpen])

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileSearchOpen &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchOpen(false)
      }
    }

    if (isMobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileSearchOpen])

  // Close mobile search on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileSearchOpen) {
        setIsMobileSearchOpen(false)
      }
    }

    if (isMobileSearchOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isMobileSearchOpen])

  const currentCartItemCount = typeof cartItemCount === "number" ? cartItemCount : getTotalItems()

  return (
    <header className={cn("bg-white sticky top-0 z-50 border-b border-gray-200", className)}>
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span className="hidden sm:block">📞 Hubungi Kami: +62 812-2408-6200</span>
          <span className="text-center sm:text-right">🚚 Gratis Ongkir untuk Pembelian di atas Rp 3.000.000</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 hidden sm:block">ThinkSale</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Cari laptop impian Anda..."
                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 focus:border-blue-500 rounded-full"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-0 lg:space-x-2 relative">
            {/* Mobile Search Container */}
            <div ref={mobileSearchContainerRef} className="md:hidden flex items-center relative">
              {/* Mobile Search Input */}
              <div
                className={cn(
                  "absolute right-12 top-1/2 -translate-y-1/2",
                  "transition-all duration-300 ease-in-out",
                  isMobileSearchOpen
                    ? "w-48 opacity-100 translate-x-0"
                    : "w-0 opacity-0 translate-x-4 pointer-events-none",
                )}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    ref={mobileSearchInputRef}
                    placeholder="Cari produk..."
                    className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-blue-500 rounded-full text-sm"
                    value={searchTerm}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Search Toggle Button */}
              <Button variant="ghost" size="icon" onClick={toggleMobileSearch} className="relative z-10">
                {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
            </div>

            {/* User Button */}
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {currentCartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {currentCartItemCount > 99 ? "99+" : currentCartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
