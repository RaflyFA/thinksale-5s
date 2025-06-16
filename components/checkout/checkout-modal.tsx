"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useCart } from "@/lib/cart/cart-context"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils/cn"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryOption, setDeliveryOption] = useState<"cod" | "delivery" | "">("")
  const [contactNumber, setContactNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName("")
      setAddress("")
      setDeliveryOption("")
      setContactNumber("")
      setIsProcessing(false)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      alert("Nama lengkap wajib diisi!")
      return
    }

    if (!address.trim()) {
      alert("Alamat wajib diisi!")
      return
    }

    if (!deliveryOption) {
      alert("Pilih salah satu opsi pengiriman!")
      return
    }

    setIsProcessing(true)

    // Create order summary
    const orderItems = items
      .map(
        (item) =>
          `• ${item.product.name} (RAM: ${item.ram}, SSD: ${item.ssd}) - ${item.quantity}x - Rp ${formatPrice(item.price * item.quantity)}`,
      )
      .join("\n")

    const deliveryText = deliveryOption === "cod" ? "COD di Universitas Siliwangi" : "Antarkan Langsung ke Alamat Rumah"

    const message = `
Halo, saya ingin memesan:

*INFORMASI PEMESAN:*
Nama Lengkap: ${fullName}
Alamat: ${address}
${contactNumber.trim() ? `Nomor yang bisa dihubungi: ${contactNumber}` : ""}

*DETAIL PESANAN:*
${orderItems}

*PENGIRIMAN:*
Opsi: ${deliveryText}

*TOTAL PEMBAYARAN:*
Rp ${formatPrice(getTotalPrice())}

Terima kasih!
    `.trim()

    // Simulate processing
    setTimeout(() => {
      // Open WhatsApp
      window.open(`https://wa.me/6281224086200?text=${encodeURIComponent(message)}`, "_blank")

      // Clear cart and close modal
      clearCart()
      setIsProcessing(false)
      onClose()

      // Redirect to home or show success message
      router.push("/")
    }, 1000)
  }

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-[999] flex items-end justify-center",
        "bg-black/50",
        "transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white w-full max-w-2xl rounded-t-2xl shadow-xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full",
          "max-h-[90vh] overflow-y-auto",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 rounded-t-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle id="checkout-title" className="text-xl font-bold">
              Checkout Pesanan
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup checkout">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-900">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  className="w-full min-h-[100px]"
                  required
                />
                <p className="text-xs text-gray-500">Isi alamat yaitu RT/RW, Kampung, Desa, Kecamatan, Kode Pos</p>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Opsi Pengiriman <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("cod")}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300 font-semibold",
                      deliveryOption === "cod"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "border-2 border-gray-200 hover:border-gray-300 text-gray-900",
                    )}
                  >
                    <div className="font-semibold">COD di Universitas Siliwangi</div>
                    <div className={cn("text-sm mt-1", deliveryOption === "cod" ? "text-white/90" : "text-gray-600")}>
                      Bayar saat barang diterima
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("delivery")}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300 font-semibold",
                      deliveryOption === "delivery"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "border-2 border-gray-200 hover:border-gray-300 text-gray-900",
                    )}
                  >
                    <div className="font-semibold">Antarkan Langsung ke Alamat Rumah</div>
                    <div
                      className={cn("text-sm mt-1", deliveryOption === "delivery" ? "text-white/90" : "text-gray-600")}
                    >
                      Pengiriman ke alamat yang ditentukan
                    </div>
                  </button>
                </div>
              </div>

              {/* Contact Number (Optional) */}
              <div className="space-y-2">
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-900">
                  Nomor yang bisa dihubungi (Opsional)
                </label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Nomor telepon selain nomor WhatsApp pemesan.</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-900">Ringkasan Pesanan</h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${item.ram}-${item.ssd}`} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.product.name}</span>
                        <span>Rp {formatPrice(item.price * item.quantity)}</span>
                      </div>
                      <div className="text-gray-600">
                        Spesifikasi: RAM {item.ram}, SSD {item.ssd}
                      </div>
                      <div className="text-gray-600">Jumlah: {item.quantity}</div>
                      {index < items.length - 1 && <hr className="my-2" />}
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span>Opsi Pengiriman:</span>
                      <span className="font-medium">
                        {deliveryOption === "cod"
                          ? "COD di Universitas Siliwangi"
                          : deliveryOption === "delivery"
                            ? "Antar Alamat Rumah"
                            : "Belum Dipilih"}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                      <span>Total:</span>
                      <span>Rp {formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-sm lg:teks:lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isProcessing ? "Memproses..." : "Lanjutkan ke WhatsApp"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
