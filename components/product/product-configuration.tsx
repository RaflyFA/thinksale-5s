"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart/cart-context"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils/cn"

interface ProductConfigurationProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductConfiguration({ product, isOpen, onClose }: ProductConfigurationProps) {
  const [selectedRam, setSelectedRam] = useState(product.ramOptions[0])
  const [selectedSsd, setSelectedSsd] = useState(product.ssdOptions[0])
  const [isProcessing, setIsProcessing] = useState(false)

  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Find the price for selected configuration
  const selectedVariant = product.variants.find((variant) => variant.ram === selectedRam && variant.ssd === selectedSsd)
  const currentPrice = selectedVariant?.price || 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login?redirect=/keranjang")
      return
    }

    addItem({
      product,
      ram: selectedRam,
      ssd: selectedSsd,
      price: currentPrice,
    })

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onClose()
      // Show success message or redirect to cart
      router.push("/keranjang")
    }, 1000)
  }

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/keranjang")
      return
    }

    // Add to cart first
    addItem({
      product,
      ram: selectedRam,
      ssd: selectedSsd,
      price: currentPrice,
    })

    // Then redirect to cart for checkout
    router.push("/keranjang")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div
        className={cn(
          "bg-white w-full max-w-2xl rounded-t-2xl transform transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <Card className="border-0 rounded-t-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold">Konfigurasi Produk</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 relative bg-gray-50 rounded-lg overflow-hidden">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.processor}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatPrice(currentPrice)}</p>
              </div>
            </div>

            {/* RAM Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">RAM</h4>
              <div className="flex flex-wrap gap-3">
                {product.ramOptions.map((ram) => (
                  <Button
                    key={ram}
                    variant={selectedRam === ram ? "default" : "outline"}
                    onClick={() => setSelectedRam(ram)}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all duration-200",
                      selectedRam === ram ? "bg-blue-600 text-white" : "hover:border-blue-500 hover:text-blue-600",
                    )}
                  >
                    {ram}
                  </Button>
                ))}
              </div>
            </div>

            {/* SSD Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">SSD</h4>
              <div className="flex flex-wrap gap-3">
                {product.ssdOptions.map((ssd) => (
                  <Button
                    key={ssd}
                    variant={selectedSsd === ssd ? "default" : "outline"}
                    onClick={() => setSelectedSsd(ssd)}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all duration-200",
                      selectedSsd === ssd ? "bg-blue-600 text-white" : "hover:border-blue-500 hover:text-blue-600",
                    )}
                  >
                    {ssd}
                  </Button>
                ))}
              </div>
            </div>

            {/* Total and Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                <p className="text-sm text-gray-600">Total Harga</p>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(currentPrice)}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddToCart} disabled={isProcessing} className="px-6 py-3">
                  {isProcessing ? "Menambah..." : "Tambah ke Keranjang"}
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
