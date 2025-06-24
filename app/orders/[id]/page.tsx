"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Package, 
  Phone, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  Calendar,
  MapPin,
  CreditCard
} from "lucide-react"
import { toast } from "sonner"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"

interface OrderStatusHistory {
  id: string
  status: string
  notes: string
  created_at: string
  changed_by_user?: {
    id: string
    name: string
  }
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_option: string
  total_amount: number
  status: string
  whatsapp_message: string
  admin_notes: string
  created_at: string
  updated_at: string
  order_items: Array<{
    id: string
    quantity: number
    unit_price: number
    total_price: number
    ram: string
    ssd: string
    product: {
      id: string
      name: string
      image: string
      processor: string
    }
  }>
  order_status_history: OrderStatusHistory[]
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Order not found')
      }
      
      const orderData = await response.json()
      setOrder(orderData)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const copyOrderNumber = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number)
      toast.success("Order number copied to clipboard!")
    }
  }

  const sendWhatsApp = () => {
    if (order?.whatsapp_message) {
      const message = encodeURIComponent(order.whatsapp_message)
      window.open(`https://wa.me/6281224086200?text=${message}`, "_blank")
    }
  }

  const getStatusIcon = (status: string) => {
    const statusIcons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle
    }
    
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock
    return <Icon className="h-5 w-5" />
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, text: "Menunggu Konfirmasi" },
      confirmed: { variant: "default" as const, text: "Dikonfirmasi" },
      processing: { variant: "default" as const, text: "Diproses" },
      shipped: { variant: "default" as const, text: "Dikirim" },
      delivered: { variant: "default" as const, text: "Diterima" },
      cancelled: { variant: "destructive" as const, text: "Dibatalkan" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline" as const, text: status }
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  const getStatusStep = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Pesanan Dibuat' },
      { key: 'confirmed', label: 'Dikonfirmasi' },
      { key: 'processing', label: 'Diproses' },
      { key: 'shipped', label: 'Dikirim' },
      { key: 'delivered', label: 'Diterima' }
    ]
    
    return steps.findIndex(step => step.key === status) + 1
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState 
          title="Order tidak ditemukan"
          message={error || "Order tidak dapat dimuat"}
          onRetry={() => router.push("/")}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Track Pesanan</h1>
              <p className="text-sm text-gray-600">Lacak status pesanan Anda</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Status Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Status */}
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Status Saat Ini</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Langkah {getStatusStep(order.status)} dari 5
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-4">
                    {order.order_status_history
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((history, index) => (
                        <div key={history.id} className="flex gap-4">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{getStatusBadge(history.status).props.children}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(history.created_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{history.notes}</p>
                            {history.changed_by_user && (
                              <p className="text-xs text-gray-500 mt-1">
                                Diubah oleh: {history.changed_by_user.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                      <p className="font-medium">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Pengiriman</p>
                      <p className="font-medium">
                        {order.delivery_option === 'cod' 
                          ? 'COD di Universitas Siliwangi' 
                          : 'Antar ke Alamat Rumah'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Pembayaran</p>
                      <p className="font-medium text-blue-600">
                        Rp {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Status Pembayaran</p>
                      <p className="font-medium">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Produk yang Dipesan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                        {/* Product image would go here */}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.processor}</p>
                        <p className="text-sm text-gray-600">
                          RAM: {item.ram} | SSD: {item.ssd}
                        </p>
                        <p className="text-sm text-gray-600">
                          Jumlah: {item.quantity} × Rp {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Rp {formatPrice(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes */}
            {order.admin_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Catatan Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.admin_notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{order.order_number}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyOrderNumber}
                      className="h-6 w-6"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nama Pelanggan</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Telepon</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alamat</p>
                  <p className="font-medium text-sm">{order.customer_address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={sendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Hubungi via WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  Kembali ke Beranda
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Butuh Bantuan?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Hubungi kami di:</p>
                  <p className="font-medium">📞 +62 812-2408-6200</p>
                  <p className="font-medium">📧 admin@thinksale.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 