"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils/cn"
import { toast } from "sonner"

interface CartItem {
  product: any
  ram: string
  ssd: string
  price: number
  quantity: number
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  totalPrice: number
}

export default function CheckoutModal({ isOpen, onClose, items, totalPrice }: CheckoutModalProps) {
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryOption, setDeliveryOption] = useState<"cod" | "delivery" | "">("")
  const [contactNumber, setContactNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error("Nama lengkap wajib diisi!")
      return
    }

    if (!address.trim()) {
      toast.error("Alamat wajib diisi!")
      return
    }

    if (!deliveryOption) {
      toast.error("Pilih salah satu opsi pengiriman!")
      return
    }

    if (!items || items.length === 0) {
      toast.error("Tidak ada produk yang dipilih!")
      return
    }

    setIsProcessing(true)

    try {
      // 1. Kirim data ke API orders
      const orderData = {
        customer_name: fullName.trim(),
        customer_phone: contactNumber.trim(),
        customer_address: address.trim(),
        delivery_option: deliveryOption,
        total_amount: totalPrice,
        items: items.map(item => ({
          product_id: item.product.id,
          variant_id: (item as any).variant_id || null,
          quantity: item.quantity,
          price: item.price,
          ram: item.ram,
          ssd: item.ssd
        }))
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const { order } = await response.json()

      // 2. Generate pesan WhatsApp
      const orderItems = items
        .map(
          (item) =>
            `• ${item.product.name} (RAM: ${item.ram}, SSD: ${item.ssd}) - ${item.quantity}x - Rp ${formatPrice(item.price * item.quantity)}`
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
Rp ${formatPrice(totalPrice)}

*ORDER NUMBER: ${order.order_number}*

Terima kasih!
      `.trim()

      // 3. Redirect ke WhatsApp
      window.open(`https://wa.me/6281224086200?text=${encodeURIComponent(message)}`, "_blank")

      // 4. Show success, close modal, redirect
      toast.success("Pesanan berhasil dibuat!", { description: `Order Number: ${order.order_number}` })
      onClose()
      router.push(`/orders/${order.id}/success`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Gagal membuat pesanan. Silakan coba lagi.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <Input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap *
                </label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle>Opsi Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="cod"
                    checked={deliveryOption === "cod"}
                    onChange={(e) => setDeliveryOption(e.target.value as "cod" | "delivery")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium">COD di Universitas Siliwangi</span>
                    <p className="text-sm text-gray-600">Bayar di tempat saat pengambilan</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={deliveryOption === "delivery"}
                    onChange={(e) => setDeliveryOption(e.target.value as "cod" | "delivery")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium">Antarkan Langsung ke Alamat Rumah</span>
                    <p className="text-sm text-gray-600">Bayar di tempat saat pengiriman</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        RAM: {item.ram}, SSD: {item.ssd} - {item.quantity}x
                      </p>
                    </div>
                    <p className="font-medium">Rp {formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rp {formatPrice(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl"
          >
            {isProcessing ? "Memproses..." : "Buat Pesanan"}
          </Button>
        </form>
      </div>
    </div>
  )
}
