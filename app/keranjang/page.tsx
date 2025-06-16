"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PageLayout from "@/components/layout/page-layout"
import SectionHeader from "@/components/ui/section-header"
import { useCart } from "@/lib/cart/cart-context"
import { useAuth } from "@/lib/auth/auth-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import CheckoutModal from "@/components/checkout/checkout-modal"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/keranjang")
      return
    }

    setShowCheckout(true)
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 bg-slate-200">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Silakan Login Terlebih Dahulu</h2>
            <p className="text-gray-600 mb-8">Anda perlu login untuk melihat keranjang belanja</p>
            <Button
              onClick={() => router.push("/login?redirect=/keranjang")}
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="Keranjang Belanja" description={`${getTotalItems()} item dalam keranjang Anda`} />

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Keranjang Anda Kosong</h3>
            <p className="text-gray-600 mb-8">Mulai berbelanja dan tambahkan produk ke keranjang</p>
            <Button
              onClick={() => router.push("/produk")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
            >
              Mulai Belanja
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.product.id}-${item.ram}-${item.ssd}`} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{item.product.name}</h3>
                          <p className="text-gray-600 text-sm">{item.product.processor}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">RAM: {item.ram}</span>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              SSD: {item.ssd}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.ram, item.ssd, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.ram, item.ssd, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="text-right">
                              <p className="font-bold text-lg text-blue-600">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatPrice(item.price)} × {item.quantity}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.product.id, item.ram, item.ssd)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Ringkasan Pesanan</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} item)</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ongkos Kirim</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
                  >
                    {isProcessing ? "Memproses..." : "Checkout"}
                  </Button>

                  <Button variant="outline" onClick={() => router.push("/produk")} className="w-full">
                    Lanjut Belanja
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </PageLayout>
  )
}
