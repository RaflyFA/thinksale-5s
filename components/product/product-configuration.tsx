"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart/cart-context"
import CheckoutModal from "@/components/checkout/checkout-modal"
import { cn } from "@/lib/utils/cn"
import type { Product } from "@/lib/types"
import { isDiscountActive } from "@/lib/utils/product-helpers"

interface ProductConfigurationProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductConfiguration({ product, isOpen, onClose }: ProductConfigurationProps) {
  const [selectedRam, setSelectedRam] = useState<string>("")
  const [selectedSsd, setSelectedSsd] = useState<string>("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
  const { addItem } = useCart()
  const router = useRouter()

  // Initialize default selections when modal opens
  useEffect(() => {
    if (isOpen && product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0]
      setSelectedRam(firstVariant.ram)
      setSelectedSsd(firstVariant.ssd)
    }
  }, [isOpen, product.variants])

  // Control body overflow when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const currentOverlayRef = overlayRef.current
    if (currentOverlayRef) {
      currentOverlayRef.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      if (currentOverlayRef) {
        currentOverlayRef.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Find selected variant and price
  const selectedVariant = product.variants?.find(
    (variant) => variant.ram === selectedRam && variant.ssd === selectedSsd,
  )

  const hasDiscount = isDiscountActive(product);
  const basePrice = selectedVariant ? selectedVariant.price : 0;
  
  const discountedPrice = hasDiscount && product.discount_percentage
    ? Math.round(basePrice * (1 - product.discount_percentage / 100))
    : basePrice;

  const currentPrice = discountedPrice;

  // Get unique RAM and SSD options
  const ramOptions = product.variants ? [...new Set(product.variants.map((v) => v.ram))].sort() : []
  const ssdOptions = product.variants ? [...new Set(product.variants.map((v) => v.ssd))].sort() : []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const handleCheckout = () => {
    if (!session?.user) {
      const currentUrl = window.location.pathname + window.location.search
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`)
      onClose()
      return
    }

    if (!selectedVariant) {
      alert("Silakan pilih konfigurasi produk")
      return
    }

    setIsProcessing(true)

    // Tambahkan item ke keranjang
    addItem({
      product,
      ram: selectedRam,
      ssd: selectedSsd,
      price: currentPrice,
    })

    // Setelah menambah ke keranjang, langsung buka checkout modal
    setTimeout(() => {
      setIsProcessing(false)
      onClose() // Tutup modal konfigurasi
      setShowCheckout(true) // Buka modal checkout
    }, 500)
  }

  return (
    <>
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-[9999] flex items-end justify-center",
          "bg-black/50",
          "transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          ref={modalRef}
          className={cn(
            "bg-white w-full lg:w-2/4 rounded-t-2xl shadow-xl",
            "transform transition-transform duration-300 ease-out",
            isOpen ? "translate-y-0" : "translate-y-full",
            "max-h-[90vh] overflow-y-auto",
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-title"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 rounded-t-2xl ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-6 border-b">
              <CardTitle id="config-title" className="text-lg lg:text-xl font-semibold">
                Konfigurasi Produk
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup konfigurasi">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-6 mb-8 lg:mb-2">
              {/* Product Info */}
              <div className="flex gap-4 mb-10">
                <div className="w-36 h-36 lg:w-52 lg:h-52 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover " />
                </div>
                <div className="flex-1 ml-5">
                  <h3 className="font-semibold text-gray-900 text-lg lg:text-xl leading-tight">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.processor}</p>
                  {/* --- Start: Price Display --- */}
                  <div className="mt-2">
                    <p className="text-blue-600 font-bold text-lg">Rp {formatPrice(currentPrice)}</p>
                    {hasDiscount && (
                      <p className="text-gray-500 text-sm line-through">
                        Rp {formatPrice(basePrice)}
                      </p>
                    )}
                  </div>
                  {/* --- End: Price Display --- */}
                </div>
              </div>

              {/* RAM Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Pilih RAM</label>
                <div className="grid grid-cols-2 gap-3">
                  {ramOptions.map((ram) => (
                    <button
                      key={ram}
                      type="button"
                      onClick={() => setSelectedRam(ram)}
                      className={cn(
                        "p-3 rounded-xl text-left transition-all duration-300 font-semibold",
                        selectedRam === ram
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "border-2 border-gray-200 hover:border-gray-300 text-gray-900",
                      )}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>

              {/* SSD Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Pilih SSD</label>
                <div className="grid grid-cols-2 gap-3">
                  {ssdOptions.map((ssd) => (
                    <button
                      key={ssd}
                      type="button"
                      onClick={() => setSelectedSsd(ssd)}
                      className={cn(
                        "p-3 rounded-xl text-left transition-all duration-300 font-semibold",
                        selectedSsd === ssd
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "border-2 border-gray-200 hover:border-gray-300 text-gray-900",
                      )}
                    >
                      {ssd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Configuration Summary */}
              {selectedRam && selectedSsd && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Konfigurasi yang Dipilih:</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">RAM:</span> {selectedRam}</p>
                    <p><span className="font-medium">SSD:</span> {selectedSsd}</p>
                    <p><span className="font-medium">Harga:</span> Rp {formatPrice(currentPrice)}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleCheckout}
                  disabled={!selectedRam || !selectedSsd || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-sm lg:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isProcessing ? "Memproses..." : "Beli Sekarang"}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full py-4 text-sm lg:text-lg font-semibold rounded-xl"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={[
          {
            product,
            ram: selectedRam,
            ssd: selectedSsd,
            price: currentPrice,
            quantity: 1,
          },
        ]}
        totalPrice={currentPrice}
      />
    </>
  )
}
