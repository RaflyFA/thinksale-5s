"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PageLayout from "@/components/layout/page-layout"
import SectionHeader from "@/components/ui/section-header"
import { useCart } from "@/lib/cart/cart-context"
import { useSession } from "next-auth/react"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import CheckoutModal from "@/components/checkout/checkout-modal"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // --- Checkbox state ---
  const [checkedIds, setCheckedIds] = useState<string[]>([])

  // Restore checked state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cartCheckedIds")
    if (saved) setCheckedIds(JSON.parse(saved))
  }, [])

  // Persist checked state to localStorage
  useEffect(() => {
    localStorage.setItem("cartCheckedIds", JSON.stringify(checkedIds))
  }, [checkedIds])

  // Helper to get unique item id
  const getItemId = (item: any) => `${item.product.id}-${item.ram}-${item.ssd}`

  // Handler for individual checkbox
  const handleCheck = (itemId: string) => {
    setCheckedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Handler for 'Pilih Semua'
  const handleCheckAll = () => {
    if (checkedIds.length === items.length) {
      setCheckedIds([])
    } else {
      setCheckedIds(items.map(getItemId))
    }
  }

  // Only checked items for checkout
  const checkedItems = items.filter(item => checkedIds.includes(getItemId(item)))

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
    if (!session?.user) {
      router.push("/login?callbackUrl=/keranjang")
      return
    }
    setShowCheckout(true)
  }

  if (!session?.user) {
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
              onClick={() => router.push("/login?callbackUrl=/keranjang")}
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

        {/* Pilih Semua Checkbox */}
        {items.length > 0 && (
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={checkedIds.length === items.length && items.length > 0}
              onChange={handleCheckAll}
              className="mr-2 w-5 h-5 accent-blue-600"
            />
            <span className="text-sm font-medium select-none">Pilih Semua</span>
          </div>
        )}

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
              {items.map((item) => {
                const itemId = getItemId(item)
                return (
                  <Card key={itemId} className="overflow-hidden">
                    <CardContent className="p-6 flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(itemId)}
                        onChange={() => handleCheck(itemId)}
                        className="mt-2 mr-2 w-5 h-5 accent-blue-600"
                      />
                      <div className="w-full flex flex-col sm:flex-row gap-4">
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
                                  {formatPrice(item.price)} per item
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
                )
              })}
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ringkasan Belanja</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Total Item ({getTotalItems()})</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Bayar</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={checkedItems.length === 0 || isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl"
                  >
                    {isProcessing ? "Memproses..." : `Checkout (${checkedItems.length} item)`}
                  </Button>

                  {checkedItems.length === 0 && items.length > 0 && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Pilih item yang ingin dibeli
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          items={checkedItems}
          totalPrice={getTotalPrice()}
        />
      </div>
    </PageLayout>
  )
}
