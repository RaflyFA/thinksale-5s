// components/layout/header.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, X, LogIn, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/lib/cart/cart-context"
import { useSettings } from "@/lib/providers/settings-provider"
import { cn } from "@/lib/utils/cn"
import BrandLogo from "@/components/ui/brand-logo"

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

  const { data: session, status } = useSession()
  const { getTotalItems } = useCart()
  const { settings } = useSettings()
  const router = useRouter()

  // Use settings data or fallback to defaults
  const contactPhone = settings?.general?.contact_phone || "+62 812-2408-6200"

  const handleCartClick = () => {
    if (!session?.user) {
      router.push("/login?callbackUrl=/keranjang")
    } else {
      router.push("/keranjang")
    }
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
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
    <>
      {/* Top Bar - Scrolls with page */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span className="hidden sm:block">📞 Hubungi Kami: {contactPhone}</span>
          <span className="text-center sm:text-right">🚚 Gratis Ongkir untuk Pembelian di atas Rp 3.000.000</span>
        </div>
      </div>

      {/* Main Navigation - Fixed/Sticky */}
      <header className={cn("bg-white sticky top-0 z-50 border-b border-gray-200", className)}>
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <BrandLogo size="lg" showText={true} className="hidden sm:flex" />
              <BrandLogo size="lg" showText={false} className="sm:hidden" />
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

              {/* User/Login Button */}
              {status === "loading" ? (
                // Loading state
                <Button variant="ghost" size="icon" disabled>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                </Button>
              ) : session?.user ? (
                // User is logged in - Show dropdown menu
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profil')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil Saya</span>
                    </DropdownMenuItem>
                    {session.user.role === "admin" && (
                      <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // User is not logged in - Show login button
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLoginClick}
                  className="hidden sm:flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}

              {/* Mobile Login Button */}
              {!session?.user && status !== "loading" && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLoginClick}
                  className="sm:hidden"
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              )}

              {/* Admin Button - Only show if user is admin and not in dropdown */}
              {session?.user && session.user.role === "admin" && (
                 <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')} className="hidden lg:flex">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                 </Button>
              )}

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
    </>
  )
}
