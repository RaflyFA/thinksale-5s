"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MoreHorizontal,
  Eye,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Package,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  user_id: string
  total: number | null
  status: string | null
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
  }
  items?: Array<{
    id: string
    quantity: number
    price: number
    product?: {
      id: string
      name: string
    }
    variant?: {
      id: string
      ram: string | null
      ssd: string | null
    }
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('query', searchTerm)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Invalid response format from server')
      }
      
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          Unknown
        </Badge>
      )
    }

    const statusConfig = {
      pending: {
        icon: Clock,
        variant: "secondary" as const,
        text: "Menunggu"
      },
      processing: {
        icon: Package,
        variant: "default" as const,
        text: "Diproses"
      },
      shipped: {
        icon: Truck,
        variant: "default" as const,
        text: "Dikirim"
      },
      delivered: {
        icon: CheckCircle,
        variant: "default" as const,
        text: "Terkirim"
      },
      completed: {
        icon: CheckCircle,
        variant: "default" as const,
        text: "Selesai"
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          {status}
        </Badge>
      )
    }

    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pesanan</h2>
          <p className="text-muted-foreground">
            Kelola semua pesanan dalam sistem
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pesanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="processing">Diproses</option>
          <option value="shipped">Dikirim</option>
          <option value="delivered">Terkirim</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            Daftar lengkap semua pesanan yang masuk dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading orders...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchOrders}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user?.name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{order.user?.email || 'No email'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items?.map((item, index) => (
                            <div key={item.id}>
                              {item.product?.name || 'Unknown Product'} 
                              {item.variant && ` (${item.variant.ram || 'N/A'}, ${item.variant.ssd || 'N/A'})`}
                              {item.quantity > 1 && ` x${item.quantity}`}
                            </div>
                          )) || 'No items'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.total ? formatPrice(order.total) : 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Batalkan Pesanan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada pesanan ditemukan</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Coba ubah filter pencarian Anda' 
                      : 'Belum ada pesanan dalam sistem'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 