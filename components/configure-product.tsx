"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface ConfigureProductProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ConfigureProduct({ product, isOpen, onClose }: ConfigureProductProps) {
  const [selectedRam, setSelectedRam] = useState(product.ramOptions[0])
  const [selectedSsd, setSelectedSsd] = useState(product.ssdOptions[0])
  const [quantity, setQuantity] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [slideIn, setSlideIn] = useState(false)

  // Temukan harga berdasarkan kombinasi RAM dan SSD yang dipilih
  const getPrice = (): number => {
    const variant = product.variants.find((v) => v.ram === selectedRam && v.ssd === selectedSsd)
    return variant ? variant.price : 0
  }

  const totalPrice = getPrice() * quantity

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setSlideIn(true), 50)
    } else {
      setSlideIn(false)
    }
  }, [isOpen])

  const handleCheckout = () => {
    setShowForm(true)
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Nama lengkap wajib diisi!")
      return
    }

    // Format pesan WhatsApp
    const message = `
Halo, saya ingin memesan:

Nama Lengkap: ${name}
Alamat: ${address || "[Belum diisi]"}
Produk: ${product.name}
Spesifikasi: RAM ${selectedRam}, SSD ${selectedSsd}
Harga: Rp. ${formatPrice(getPrice())}

Metode Pengiriman:
[ ] COD di Universitas Siliwangi
[ ] Kirim ke alamat
ketik pilihan disini!!!

Terima kasih!
    `.trim()

    // Buka WhatsApp dengan pesan yang sudah diformat
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank")

    // Reset form dan tutup modal
    setName("")
    setAddress("")
    setShowForm(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[90vh] overflow-y-auto transition-transform duration-500 ease-out transform ${
          slideIn ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Responsive */}
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Konfigurasi Produk</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {showForm ? (
          /* Form Pemesanan - Responsive */
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Jika kosong, Anda akan diminta mengisi di WhatsApp</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Ringkasan Pesanan</h3>
                <p className="text-sm">Produk: {product.name}</p>
                <p className="text-sm">
                  Spesifikasi: RAM {selectedRam}, SSD {selectedSsd}
                </p>
                <p className="text-sm">Jumlah: {quantity}</p>
                <p className="font-bold mt-2 text-lg">Total: Rp {formatPrice(totalPrice)}</p>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base">
                Lanjutkan ke WhatsApp
              </Button>
            </div>
          </form>
        ) : (
          /* Konfigurasi Produk - Responsive layout */
          <div className="p-4 sm:p-6 space-y-6">
            {/* Product Image and RAM Selection - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-20 sm:w-24 flex-shrink-0 mx-auto sm:mx-0">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="rounded-lg object-cover w-full aspect-square"
                />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-bold text-lg mb-3 text-center sm:text-left">RAM</h3>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {product.ramOptions.map((ram) => (
                    <Button
                      key={ram}
                      variant={selectedRam === ram ? "default" : "outline"}
                      className={`rounded-full text-xs px-3 py-2 transition-all duration-200 ${
                        selectedRam === ram ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedRam(ram)}
                    >
                      {ram}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* SSD Selection - Responsive */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-center sm:text-left">SSD</h3>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {product.ssdOptions.map((ssd) => (
                  <Button
                    key={ssd}
                    variant={selectedSsd === ssd ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedSsd === ssd ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSsd(ssd)}
                  >
                    {ssd}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity - Responsive */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-center sm:text-left">Jumlah</h3>
              <div className="flex items-center justify-center sm:justify-start">
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-6 w-8 text-center font-medium text-lg">{quantity}</span>
                <Button variant="outline" className="h-12 w-12 rounded-full" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            {/* Price - Responsive */}
            <div className="pt-4 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="text-center sm:text-left">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl sm:text-3xl font-bold">Rp {formatPrice(totalPrice)}</p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 w-full sm:w-auto"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
