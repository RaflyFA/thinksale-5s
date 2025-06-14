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
  cartItemCount?: number;
  className?: string
}

export default function Header({ searchTerm = "", onSearchChange, className, cartItemCount }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false) // State khusus untuk search mobile
  const mobileSearchInputRef = useRef<HTMLInputElement>(null) // Ref khusus untuk search input mobile

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

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev)
  }

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus()
    }
  }, [isMobileSearchOpen])

  // Reset search term dan tutup mobile search saat berpindah halaman (opsional tapi bagus)
  useEffect(() => {
    // Ini bisa di-trigger oleh router.pathname jika Anda perlu mendengarkan perubahan URL
    // Tapi untuk komponen client-side seperti ini, onSearchChange mungkin sudah cukup
    if (!searchTerm && isMobileSearchOpen) {
      // Jika searchTerm dihapus dari luar, tutup mobile search juga
      // atau jika Anda ingin menutup search bar mobile saat navigasi, tambahkan router.events
      // Contoh sederhana:
      // const handleRouteChange = () => setIsMobileSearchOpen(false);
      // router.events.on('routeChangeStart', handleRouteChange);
      // return () => { router.events.off('routeChangeStart', handleRouteChange); };
    }
  }, [searchTerm, isMobileSearchOpen, router]);

  const currentCartItemCount = typeof cartItemCount === 'number' ? cartItemCount : getTotalItems();

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

          {/* Search Bar - Desktop (Hidden on md and below) */}
          {/* Ini adalah search bar asli desktop, tidak berubah */}
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

          {/* Action Buttons (Desktop & Mobile Icons) */}
          {/* Kontainer ini sekarang menampung tombol User/Cart/Search Mobile */}
          <div className="flex items-center space-x-0 lg:space-x-2">
            {/* Mobile Search Icon (Hanya tampil di mobile, di samping User/Cart) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSearch}
              className="md:hidden" // Hanya tampil di mobile
            >
              {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* User Button (Selalu tampil) */}
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
            </Button>

            {/* Cart Button (Selalu tampil) */}
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

        {/* Mobile Search Input - LUNAK DARI SAMPING (Hanya tampil di mobile, di baris terpisah/overlay) */}
        {/* Kontainer ini hanya akan muncul saat isMobileSearchOpen true, dan di layar md:hidden */}
        <div
          className={cn(
            "md:hidden absolute left-0 w-full px-4 pt-2 pb-4 bg-white border-b border-gray-200 transform", // Gaya dasar
            "transition-all duration-300 ease-in-out", // Animasi
            isMobileSearchOpen ? "top-full opacity-100 translate-y-0" : "-top-full opacity-0 -translate-y-full pointer-events-none", // Posisi animasi
            "z-40" // Pastikan di atas konten lain tapi di bawah header utama
          )}
          // Opsional: Jika Anda ingin input muncul dari samping bukan dari atas/bawah
          // className={cn(
          //   "md:hidden absolute left-0 w-full px-4 pt-2 pb-4 bg-white border-b border-gray-200 transform",
          //   "transition-all duration-300 ease-in-out",
          //   isMobileSearchOpen ? "left-0 opacity-100" : "left-full opacity-0 pointer-events-none", // Slide dari kanan
          //   "z-40"
          // )}
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={mobileSearchInputRef}
              placeholder="Cari produk..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onBlur={() => {
                // Tutup search bar hanya jika searchTerm kosong setelah blur
                if (!searchTerm && isMobileSearchOpen) {
                  setIsMobileSearchOpen(false);
                }
              }}
              onKeyDown={(e) => {
                // Tutup search bar saat Esc ditekan
                if (e.key === 'Escape') {
                  setIsMobileSearchOpen(false);
                }
              }}
            />
          </div>
        </div>

      </nav>
    </header>
  )
}