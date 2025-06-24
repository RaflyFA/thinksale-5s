"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/lib/cart/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShoppingCart, Package, LogOut } from "lucide-react"

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const { getTotalItems } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profil")
    }
  }, [status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-600 mt-2">Kelola informasi akun dan preferensi Anda</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{session.user.name}</h2>
                <p className="text-gray-600 text-sm">{session.user.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Total Pesanan</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{getTotalItems()}</p>
                <p className="text-sm text-gray-600">Item di Keranjang</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">Member</p>
                <p className="text-sm text-gray-600">Status Akun</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/keranjang")}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Lihat Keranjang</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/produk")}
              >
                <Package className="h-5 w-5" />
                <span>Belanja Lagi</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
