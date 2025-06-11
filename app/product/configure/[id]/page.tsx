"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ProductConfigurePage({ params }: { params: { id: string } }) {
  const [selectedRam, setSelectedRam] = useState("8 GB")
  const [selectedSsd, setSelectedSsd] = useState("128 GB")
  const [quantity, setQuantity] = useState(1)

  const ramOptions = ["8 GB", "12 GB", "16 GB"]
  const ssdOptions = ["128 GB", "256 GB", "512 GB", "1 TB"]

  const basePrice = 5200000
  const totalPrice = basePrice * quantity

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto bg-white min-h-screen">
        {/* Product Image and Price */}
        <div className="p-6 border-b">
          <div className="flex gap-4 mb-4">
            <div className="w-24 h-24 border rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=96&width=96"
                alt="Laptop"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Harga</p>
              <p className="text-2xl font-bold">Rp. {formatPrice(basePrice)}</p>
            </div>
          </div>
        </div>

        {/* RAM Selection */}
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg mb-4">Ram</h3>
          <div className="flex gap-3">
            {ramOptions.map((ram) => (
              <Button
                key={ram}
                variant={selectedRam === ram ? "default" : "outline"}
                className={`rounded-full ${
                  selectedRam === ram ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedRam(ram)}
              >
                {ram}
              </Button>
            ))}
          </div>
        </div>

        {/* SSD Selection */}
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg mb-4">SSD</h3>
          <div className="flex gap-3 flex-wrap">
            {ssdOptions.map((ssd) => (
              <Button
                key={ssd}
                variant={selectedSsd === ssd ? "default" : "outline"}
                className={`rounded-full ${
                  selectedSsd === ssd ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedSsd(ssd)}
              >
                {ssd}
              </Button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Jumlah</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-8 h-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-8 h-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Total and Checkout */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-2xl font-bold">Rp. {formatPrice(totalPrice)}</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">Check Out</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
