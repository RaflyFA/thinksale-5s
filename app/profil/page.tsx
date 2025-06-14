"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageLayout from "@/components/layout/page-layout"
import SectionHeader from "@/components/ui/section-header"
import { useAuth } from "@/lib/auth/auth-context"
import { useCart } from "@/lib/cart/cart-context"
import { User, Mail, ShoppingBag, LogOut, Settings } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Silakan Login Terlebih Dahulu</h2>
            <p className="text-gray-600 mb-8">Anda perlu login untuk melihat profil</p>
            <Button
              onClick={() => router.push("/login?redirect=/profil")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
            >
              Login Sekarang
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <SectionHeader title="Profil Saya" description="Kelola informasi akun dan preferensi Anda" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status Akun</label>
                <p className="text-lg font-semibold text-green-600">Aktif</p>
              </div>
            </CardContent>
          </Card>

          {/* Shopping Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Statistik Belanja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Item di Keranjang</label>
                <p className="text-2xl font-bold text-blue-600">{getTotalItems()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Pesanan</label>
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Member Sejak</label>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/keranjang")}
                className="flex items-center gap-2 h-12"
              >
                <ShoppingBag className="h-4 w-4" />
                Lihat Keranjang
              </Button>

              <Button variant="outline" onClick={() => router.push("/produk")} className="flex items-center gap-2 h-12">
                <Settings className="h-4 w-4" />
                Belanja Lagi
              </Button>

              <Button
                variant="outline"
                onClick={() => alert("Fitur riwayat pesanan akan segera tersedia!")}
                className="flex items-center gap-2 h-12"
              >
                <ShoppingBag className="h-4 w-4" />
                Riwayat Pesanan
              </Button>

              <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 h-12">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Notifikasi Email</h4>
                  <p className="text-sm text-gray-600">Terima update pesanan dan penawaran khusus</p>
                </div>
                <Button variant="outline" size="sm">
                  Aktif
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Keamanan Akun</h4>
                  <p className="text-sm text-gray-600">Ubah password dan pengaturan keamanan</p>
                </div>
                <Button variant="outline" size="sm">
                  Kelola
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Alamat Pengiriman</h4>
                  <p className="text-sm text-gray-600">Kelola alamat untuk pengiriman</p>
                </div>
                <Button variant="outline" size="sm">
                  Tambah
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
