"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth/auth-context"
import { useCart } from "@/lib/cart/cart-context"
import { cn } from "@/lib/utils/cn"

interface HeaderProps {
  searchTerm?: string
  onSearchChange?: (value: string) => void
  className?: string
}

export default function Header({ searchTerm = "", onSearchChange, className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
      router.push("/login?redirect=/profil")
    } else {
      router.push("/profil")
    }
  }

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
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems() > 99 ? "99+" : getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari produk..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>
      </nav>
    </header>
  )
}
