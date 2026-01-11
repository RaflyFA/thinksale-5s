"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/cn"
import type { Product } from "@/lib/types"

interface ProductSpecificationsProps {
  product: Product
  selectedRam: string
  selectedSsd: string
  onRamChange: (ram: string) => void
  onSsdChange: (ssd: string) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
  currentPrice: number
}

export default function ProductSpecifications({
  product,
  selectedRam,
  selectedSsd,
  onRamChange,
  onSsdChange,
  quantity,
  onQuantityChange,
  currentPrice,
}: ProductSpecificationsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const ramOptions = product.variants ? [...new Set(product.variants.map((v) => v.ram))].sort() : []
  const ssdOptions = product.variants ? [...new Set(product.variants.map((v) => v.ssd))].sort() : []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spesifikasi & Konfigurasi</h3>
        <p className="text-sm text-gray-600 mb-6">
          Pilih spesifikasi sesuai kebutuhan Anda dan lihat harga totalnya
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">RAM</label>
        <div className="flex flex-wrap gap-2">
          {ramOptions.map((ram) => (
            <button
              key={ram}
              onClick={() => onRamChange(ram)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                selectedRam === ram
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {ram}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">SSD</label>
        <div className="flex flex-wrap gap-2">
          {ssdOptions.map((ssd) => (
            <button
              key={ssd}
              onClick={() => onSsdChange(ssd)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                selectedSsd === ssd
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {ssd}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Jumlah</label>
        <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-9 w-9 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="min-w-[2.5rem] text-center text-base font-semibold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className="h-9 w-9 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Total Harga</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp {formatPrice(currentPrice * quantity)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Pilihan Anda:</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {selectedRam} • {selectedSsd}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
