"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, ExternalLink, Home, Package, Phone } from "lucide-react"
import { toast } from "sonner"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"

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
  created_at: string
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
    }
  }>
}

export default function OrderSuccessPage() {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di ThinkSale. Pesanan Anda telah kami terima.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Informasi Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order Number:</span>
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
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tanggal Pesanan:</span>
                  <span className="text-sm">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Pembayaran:</span>
                  <span className="font-semibold text-lg text-blue-600">
                    Rp {formatPrice(order.total_amount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Nama:</span>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                
                {order.customer_phone && (
                  <div>
                    <span className="text-sm text-gray-600">Telepon:</span>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-gray-600">Alamat:</span>
                  <p className="font-medium">{order.customer_address}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Opsi Pengiriman:</span>
                  <p className="font-medium">
                    {order.delivery_option === 'cod' 
                      ? 'COD di Universitas Siliwangi' 
                      : 'Antar ke Alamat Rumah'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Produk</CardTitle>
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
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>1. Admin akan mengkonfirmasi pesanan Anda</p>
                  <p>2. Produk akan disiapkan dan dikirim</p>
                  <p>3. Anda akan mendapat notifikasi status</p>
                </div>
                
                <Button 
                  onClick={sendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Kirim ke WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="w-full"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Track Pesanan
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
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