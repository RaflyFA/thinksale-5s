/**
 * Product Configuration Component
 *
 * Komponen konfigurasi produk yang muncul dari bawah
 * Memungkinkan user memilih spesifikasi dan melihat harga
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils/cn"

interface ProductConfigurationProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductConfiguration({ product, isOpen, onClose }: ProductConfigurationProps) {
  const [selectedRam, setSelectedRam] = useState(product.ramOptions[0])
  const [selectedSsd, setSelectedSsd] = useState(product.ssdOptions[0])
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [slideIn, setSlideIn] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryOption, setDeliveryOption] = useState<string | null>(null)
  const [contactNumber, setContactNumber] = useState("")

  // Get price based on selected specs
  const getPrice = (): number => {
    const variant = product.variants.find((v) => v.ram === selectedRam && v.ssd === selectedSsd)
    return variant ? variant.price : 0
  }

  const totalPrice = getPrice()

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setSelectedRam(product.ramOptions[0])
      setSelectedSsd(product.ssdOptions[0])
      setShowCheckoutForm(false)
      setName("")
      setAddress("")
      setDeliveryOption(null)
      setContactNumber("")
      setTimeout(() => setSlideIn(true), 50)
    } else {
      setSlideIn(false)
    }
  }, [isOpen, product])

  const handleCheckout = () => {
    setShowCheckoutForm(true)
  }

  const handleBackToConfig = () => {
    setShowCheckoutForm(false)
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Nama lengkap wajib diisi!")
      return
    }

    if (deliveryOption === "delivery" && !address.trim()) {
      alert("Alamat wajib diisi untuk opsi pengiriman ke rumah!")
      return
    }

    if (!deliveryOption) {
      alert("Pilih salah satu opsi pengiriman.")
      return
    }

    const message = `
Halo, saya ingin memesan:

Nama Lengkap: ${name}
Alamat: ${address.trim() || (deliveryOption === "cod" ? "COD di Universitas Siliwangi" : "[Alamat belum diisi]")}
Produk: ${product.name}
Spesifikasi: RAM ${selectedRam}, SSD ${selectedSsd}
Total Harga: Rp ${formatPrice(totalPrice)}

Metode Pengiriman: ${deliveryOption === "cod" ? "COD di Universitas Siliwangi" : "Kirim ke Alamat Rumah"}
${contactNumber.trim() ? `Nomor yang bisa dihubungi: ${contactNumber}` : "Nomor yang bisa dihubungi: [Tidak ada nomor lain]"}

Terima kasih!
    `.trim()

    window.open(`https://wa.me/6281224086200?text=${encodeURIComponent(message)}`, "_blank")

    // Reset and close
    setName("")
    setAddress("")
    setDeliveryOption(null)
    setContactNumber("")
    setShowCheckoutForm(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto transition-transform duration-500 ease-out transform",
          slideIn ? "translate-y-0" : "translate-y-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-4">
            {showCheckoutForm && (
              <Button variant="ghost" size="icon" onClick={handleBackToConfig} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {showCheckoutForm ? "Informasi Pemesanan" : "Konfigurasi Produk"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {showCheckoutForm ? (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Alamat
                  {deliveryOption === "delivery" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required={deliveryOption === "delivery"}
                />
                <p className="text-xs text-gray-500 mt-1">Isi alamat yaitu RT/RW, Kampung, Desa, Kecamatan, Kode Pos</p>
              </div>

              {/* Delivery Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Opsi Pengiriman <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("cod")}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                      deliveryOption === "cod"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="font-medium">COD di Universitas Siliwangi</div>
                    <div className="text-sm text-gray-600 mt-1">Bayar saat barang diterima</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("delivery")}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                      deliveryOption === "delivery"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="font-medium">Antarkan Langsung ke Alamat Rumah</div>
                    <div className="text-sm text-gray-600 mt-1">Pengiriman ke alamat yang ditentukan</div>
                  </button>
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nomor yang bisa dihubungi (Opsional)
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Contoh: 081234567890"
                />
                <p className="text-xs text-gray-500 mt-1">Nomor telepon selain nomor WhatsApp pemesan.</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Produk:</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spesifikasi:</span>
                    <span className="font-medium">
                      RAM {selectedRam}, SSD {selectedSsd}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pengiriman:</span>
                    <span className="font-medium">
                      {deliveryOption === "cod"
                        ? "COD di Universitas Siliwangi"
                        : deliveryOption === "delivery"
                          ? "Antar Alamat Rumah"
                          : "Belum Dipilih"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>Rp {formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Lanjutkan ke WhatsApp
            </Button>
          </form>
        ) : (
          /* Product Configuration */
          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600">Rp {formatPrice(totalPrice)}</p>
              </div>
            </div>

            {/* RAM Selection */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">RAM</h4>
              <div className="flex flex-wrap gap-3">
                {product.ramOptions.map((ram) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(ram)}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200",
                      selectedRam === ram
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300 text-gray-700",
                    )}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>

            {/* SSD Selection */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">SSD</h4>
              <div className="flex flex-wrap gap-3">
                {product.ssdOptions.map((ssd) => (
                  <button
                    key={ssd}
                    onClick={() => setSelectedSsd(ssd)}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200",
                      selectedSsd === ssd
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300 text-gray-700",
                    )}
                  >
                    {ssd}
                  </button>
                ))}
              </div>
            </div>

            {/* Total and Checkout */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">Rp {formatPrice(totalPrice)}</p>
              </div>
              <Button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
