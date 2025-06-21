// pages/product/[id].tsx
"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import PageLayout from "@/components/layout/page-layout"
import ProductCard from "@/components/ui/product-card"
import SectionHeader from "@/components/ui/section-header"
import ProductConfiguration from "@/components/product/product-configuration"
import { products } from "@/lib/data"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/use-auth"
import { cn } from "@/lib/utils/cn"

export default function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showConfiguration, setShowConfiguration] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()

  const productId = Array.isArray(id) ? id[0] : id
  const product = products.find((p) => p.id === productId) || products[0]

  const recommendedProducts = products.filter((p) => p.id !== productId).slice(0, 4)

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleOrderNow = () => {
    // Cek status autentikasi pengguna
    if (!user) {
      // Jika belum login, redirect ke halaman login dengan parameter redirect
      const currentUrl = `/product/${productId}`
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
      return
    }

    // Jika sudah login, tampilkan modal konfigurasi produk
    setShowConfiguration(true)
  }

  const handleAskAdmin = () => {
    const message = encodeURIComponent(
      `Halo, saya ingin bertanya tentang produk ${product.name}\n\n(isi pesan kamu disini)`,
    )
    window.open(`https://wa.me/6281224086200?text=${message}`, "_blank")
  }

  const descriptionLimit = 150
  const shortDescription =
    product.description.length > descriptionLimit
      ? product.description.substring(0, descriptionLimit) + "..."
      : product.description

  return (
    <PageLayout>
      {/* Custom Header for Product Detail */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Detail Produk</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation Arrows */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 justify-center">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    selectedImageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">Rp {product.priceRange}</p>
              <p className="text-lg text-gray-600 mb-4">{product.processor}</p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Deskripsi Produk</h3>
              <div className="text-gray-600 leading-relaxed">
                {isDescriptionExpanded ? product.description : shortDescription}
                {product.description.length > descriptionLimit && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-2 transition-colors"
                  >
                    {isDescriptionExpanded ? "Tutup" : "Baca Selengkapnya"}
                  </button>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Spesifikasi</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {product.specs.map((spec, index) => {
                  const trimmedSpec = spec.trim()
                  const isSubItem = trimmedSpec.match(/^(\d|-|\s{2,})/) || trimmedSpec.startsWith("-")

                  return (
                    <p
                      key={index}
                      className={cn("text-sm text-gray-700", isSubItem ? "pl-4 text-gray-600" : "font-medium")}
                    >
                      {isSubItem ? `• ${trimmedSpec.replace(/^(\s*[-\d])?\s*/, "")}` : trimmedSpec}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleOrderNow}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-md font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Pesan Sekarang
              </Button>
              <Button
                onClick={handleAskAdmin}
                variant="outline"
                className="px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Tanya Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <section>
          <SectionHeader
            title="Rekomendasi Untukmu"
            description="Produk lain yang mungkin Anda sukai"
            action={{
              label: "Lihat Semua",
              href: "/produk",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Product Configuration Modal */}
      <ProductConfiguration product={product} isOpen={showConfiguration} onClose={() => setShowConfiguration(false)} />
    </PageLayout>
  )
}
