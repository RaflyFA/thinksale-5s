"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useCart } from "@/lib/cart/cart-context"
import CheckoutModal from "@/components/checkout/checkout-modal"
import { cn } from "@/lib/utils/cn"
import type { Product } from "@/lib/types"

interface ProductConfigurationProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  selectedRam?: string
  selectedSsd?: string
  onRamChange?: (ram: string) => void
  onSsdChange?: (ssd: string) => void
  quantity?: number
  onQuantityChange?: (quantity: number) => void
}

export default function ProductConfiguration({
  product,
  isOpen,
  onClose,
  selectedRam: externalRam,
  selectedSsd: externalSsd,
  onRamChange: externalOnRamChange,
  onSsdChange: externalOnSsdChange,
  quantity: externalQuantity,
  onQuantityChange: externalOnQuantityChange,
}: ProductConfigurationProps) {
  const [selectedRam, setSelectedRam] = useState<string>("")
  const [selectedSsd, setSelectedSsd] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const { addItem } = useCart()

  const ram = externalRam !== undefined ? externalRam : selectedRam
  const ssd = externalSsd !== undefined ? externalSsd : selectedSsd
  const qty = externalQuantity !== undefined ? externalQuantity : quantity

  const handleRamChange = (newRam: string) => {
    if (externalOnRamChange) {
      externalOnRamChange(newRam)
    } else {
      setSelectedRam(newRam)
    }
  }

  const handleSsdChange = (newSsd: string) => {
    if (externalOnSsdChange) {
      externalOnSsdChange(newSsd)
    } else {
      setSelectedSsd(newSsd)
    }
  }

  const handleQuantityChange = (newQty: number) => {
    const safeQty = Math.max(1, newQty)
    if (externalOnQuantityChange) {
      externalOnQuantityChange(safeQty)
    } else {
      setQuantity(safeQty)
    }
  }

  useEffect(() => {
    if (isOpen && product.variants && product.variants.length > 0 && !externalRam) {
      const firstVariant = product.variants[0]
      setSelectedRam(firstVariant.ram)
      setSelectedSsd(firstVariant.ssd)
      setQuantity(1)
    }
  }, [isOpen, product.variants, externalRam])

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

  const selectedVariant = product.variants?.find((variant) => variant.ram === ram && variant.ssd === ssd)
  const currentPrice = selectedVariant ? selectedVariant.price : 0

  const ramOptions = product.variants ? [...new Set(product.variants.map((v) => v.ram))].sort() : []
  const ssdOptions = product.variants ? [...new Set(product.variants.map((v) => v.ssd))].sort() : []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const handleCheckout = () => {
    if (!selectedVariant) {
      alert("Silakan pilih konfigurasi produk")
      return
    }

    setIsProcessing(true)

    addItem({
      product,
      ram,
      ssd,
      price: currentPrice,
      quantity: qty,
    })

    setIsProcessing(false)
    onClose()
    setShowCheckout(true)
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
              <div className="flex gap-4 mb-10">
                <div className="w-36 h-36 lg:w-52 lg:h-52 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover " />
                </div>
                <div className="flex-1 ml-5">
                  <h3 className="font-semibold text-gray-900 text-lg lg:text-xl leading-tight">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.processor}</p>
                  <p className="text-blue-600 font-bold text-lg mt-2">Rp {formatPrice(currentPrice)}</p>
                </div>
              </div>

              <div className="space-y-3 ">
                <label className="block text-sm font-semibold text-gray-900">RAM</label>
                <div className="flex flex-wrap gap-2">
                  {ramOptions.map((ramOption) => (
                    <button
                      key={ramOption}
                      onClick={() => handleRamChange(ramOption)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        ram === ramOption
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {ramOption}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 ">
                <label className="block text-sm font-semibold text-gray-900">SSD</label>
                <div className="flex flex-wrap gap-2">
                  {ssdOptions.map((ssdOption) => (
                    <button
                      key={ssdOption}
                      onClick={() => handleSsdChange(ssdOption)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 mb-16",
                        ssd === ssdOption
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {ssdOption}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 -mt-12">
                <label className="block text-sm font-semibold text-gray-900">Jumlah</label>
                <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(qty - 1)}
                    className="h-9 w-9 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
                    aria-label="Kurangi jumlah"
                  >
                    -
                  </button>
                  <span className="min-w-[2.5rem] text-center text-base font-semibold text-gray-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(qty + 1)}
                    className="h-9 w-9 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  <p className="text-xs text-gray-600">Total Harga</p>
                  <p className="text-lg font-bold text-gray-900">Rp {formatPrice(currentPrice * qty)}</p>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || !selectedVariant}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {isProcessing ? "Processing..." : "Checkout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </>
  )
}
