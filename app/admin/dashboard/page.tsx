"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Package2,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

import { LoadingState } from "@/components/admin/shared/loading-state"
import { StatusBadge } from "@/components/admin/shared/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils/admin-helpers"
import type { DashboardStats, LoadingState as LoadingStateType } from "@/lib/types/admin"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingStateType>({
    isLoading: true,
    error: null
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoadingState({ isLoading: true, error: null })
      
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Format respons dari server tidak valid')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err)
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setLoadingState({ isLoading: false, error: errorMessage })
      toast.error('Gagal memuat data dashboard')
    } finally {
      setLoadingState({ isLoading: false, error: null })
    }
  }

  // Tampilkan loading atau error
  if (loadingState.isLoading || loadingState.error || !stats) {
    return (
      <LoadingState
        isLoading={loadingState.isLoading}
        error={loadingState.error}
        onRetry={fetchDashboardStats}
        loadingText="Memuat dashboard..."
        errorText="Gagal memuat data dashboard"
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan performa toko dan aktivitas terbaru
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Lihat Analitik
          </Button>
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total dari semua pesanan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Pengguna terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produk tersedia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total pesanan masuk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan Stok */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Total item inventaris
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Tersedia</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStockProductCount}</div>
            <p className="text-xs text-muted-foreground">
              Jumlah produk yang punya minimal 1 varian stok &gt; 0
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Kosong</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockProductCount}</div>
            <p className="text-xs text-muted-foreground">
              Jumlah produk yang semua variannya stoknya 0
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Konten Utama */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Pesanan Terbaru */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>
                Transaksi terbaru dari toko Anda
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders">
                Lihat Semua
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">Belum ada pesanan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.order_number}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.payment_status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Aksi Cepat */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Tugas admin yang sering dilakukan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/products/new">
                <Package className="mr-2 h-4 w-4" />
                Tambah Produk
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/products">
                <Package2 className="mr-2 h-4 w-4" />
                Kelola Produk
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/stock">
                <Package2 className="mr-2 h-4 w-4" />
                Kelola Stok
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/orders">
                <CreditCard className="mr-2 h-4 w-4" />
                Lihat Pesanan
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Kelola Pengguna
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stok Habis */}
      {stats.stockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Stok Habis
            </CardTitle>
            <CardDescription>
              Daftar varian produk yang stoknya habis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.stockAlerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.product_name}</p>
                    {alert.variant_info && (
                      <p className="text-xs text-muted-foreground">
                        {alert.variant_info}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-600">
                      {alert.quantity} tersisa
                    </p>
                    <Badge
                      variant="destructive"
                      className="text-xs"
                    >
                      Stok Habis
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {stats.stockAlerts.length > 6 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/stock">
                    Lihat Semua Stok Habis ({stats.stockAlerts.length})
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 