"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import ProductCard from "@/components/product-card"
import ConfigureProduct from "@/components/configure-product"
import { products } from "@/lib/data"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showConfigure, setShowConfigure] = useState(false)

  // Temukan produk berdasarkan ID
  const product = products.find((p) => p.id === params.id) || products[0]

  // Produk rekomendasi (2 produk acak selain produk saat ini)
  const recommendedProducts = products
    .filter((p) => p.id !== params.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleOrderNow = () => {
    setShowConfigure(true)
  }

  const handleAskAdmin = () => {
    const message = encodeURIComponent("Apa yang ingin kamu tanyakan??")
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20 sm:pb-24">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-xl font-semibold">Detail Produk</h1>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Product Images and Info - Responsive container */}
        <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto">
          <Card className="bg-white mb-6">
            <CardContent className="p-0">
              {/* Product Images - Responsive aspect ratio */}
              <div className="relative mb-4">
                <div className="aspect-square w-full relative">
                  <Image
                    src={product.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    priority
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Images - Responsive sizing */}
              <div className="flex justify-center gap-2 px-4 mb-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImageIndex === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Product Info - Responsive typography */}
              <div className="p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-4">Rp {product.priceRange}</p>

                <div className="mb-6">
                  <p className="font-medium mb-2 text-sm sm:text-base">{product.description}</p>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{product.processor}</p>

                  <div className="space-y-1">
                    {product.specs.map((spec, index) => (
                      <p key={index} className="text-xs sm:text-sm text-gray-600">
                        • {spec}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Products - Responsive grid */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Rekomendasi Untukmu</h2>
              <Link href="/recommended" className="text-blue-600 hover:underline text-sm sm:text-base">
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Action Buttons - Responsive positioning */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 w-12 h-12 sm:w-10 sm:h-10"
            onClick={handleAskAdmin}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm sm:text-base"
            onClick={handleOrderNow}
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>

      {/* Configure Product Slide Up */}
      <ConfigureProduct product={product} isOpen={showConfigure} onClose={() => setShowConfigure(false)} />
    </div>
  )
}
