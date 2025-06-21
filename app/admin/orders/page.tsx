"use client"

import { useState } from "react"
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
} from "lucide-react"

// Mock order data - nanti bisa diganti dengan data real dari Supabase
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    products: [
      { name: "Lenovo ThinkPad T470", quantity: 1, price: 8500000 }
    ],
    total: 8500000,
    status: "pending",
    createdAt: "2024-01-20 10:30",
    updatedAt: "2024-01-20 10:30"
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    products: [
      { name: "Dell Latitude 5520", quantity: 2, price: 7500000 }
    ],
    total: 15000000,
    status: "processing",
    createdAt: "2024-01-19 15:45",
    updatedAt: "2024-01-20 09:15"
  },
  {
    id: "ORD-003",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    products: [
      { name: "Lenovo ThinkPad X1 Carbon", quantity: 1, price: 12000000 }
    ],
    total: 12000000,
    status: "shipped",
    createdAt: "2024-01-18 14:20",
    updatedAt: "2024-01-19 16:30"
  },
  {
    id: "ORD-004",
    customerName: "Alice Brown",
    customerEmail: "alice@example.com",
    products: [
      { name: "Dell Precision 5560", quantity: 1, price: 18000000 }
    ],
    total: 18000000,
    status: "delivered",
    createdAt: "2024-01-17 11:10",
    updatedAt: "2024-01-18 14:45"
  }
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filter orders based on search and status
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statuses = [
    { id: "all", name: "Semua Status" },
    { id: "pending", name: "Menunggu" },
    { id: "processing", name: "Diproses" },
    { id: "shipped", name: "Dikirim" },
    { id: "delivered", name: "Terkirim" }
  ]

  const getStatusBadge = (status: string) => {
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
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
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
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.products.map((product, index) => (
                        <div key={index}>
                          {product.name} (x{product.quantity})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
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

          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada pesanan ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah filter pencarian Anda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 