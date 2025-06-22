"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Star, TrendingUp, Package, Clock } from "lucide-react"
import ScrollableProductList from "@/components/scrollable-product-list"
import ConfigureProduct from "@/components/product/product-configuration"
import { useCart } from "@/lib/cart/cart-context"
import { cn } from "@/lib/utils/cn"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { isDiscountActive, getBasePrice, getDiscountedPrice } from "@/lib/utils/product-helpers"
import { useProductById, useProducts } from "@/lib/hooks/use-products"

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const productId = Array.isArray(id) ? id[0] : id
  const { addItem } = useCart()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showConfigure, setShowConfigure] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  // --- Data Fetching using React Query ---
  const { data: product, isLoading: loading, error } = useProductById(productId)
  const { data: allProducts } = useProducts()

  // --- Memoized Recommended Products ---
  const recommendedProducts = useMemo(() => {
    if (!allProducts || !productId) return []
    return allProducts
      .filter((p) => p.id !== productId)
      .slice(0, 10)
  }, [allProducts, productId])

  // --- Effect to set default variant ---
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        setSelectedVariant(product.variants[0].id)
      }
    }
  }, [product, selectedVariant])
  
  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-200 flex justify-center items-center">
        <ErrorState 
          title="Produk tidak ditemukan"
          message={error?.message || "Produk ini tidak tersedia."}
          onRetry={() => window.history.back()}
        />
      </div>
    )
  }
  
  const hasDiscount = isDiscountActive(product);
  const basePrice = getBasePrice(product);
  const discountedPrice = getDiscountedPrice(product);

  const totalStock = useMemo(() => {
    if (!product?.variants) return 0;
    return product.variants.reduce((acc: number, variant: any) => acc + (variant.stock || 0), 0);
  }, [product?.variants]);

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ['/placeholder.svg']

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    )
  }

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants && product.variants.length > 0) return
    const variant = product.variants?.find((v: any) => v.id === selectedVariant)
    addItem({
      product,
      ram: variant ? variant.ram : "",
      ssd: variant ? variant.ssd : "",
      price: variant ? variant.price : 0,
    })
  }

  const handleOrderNow = () => {
    setShowConfigure(true)
  }

  const handleAskAdmin = () => {
    const message = encodeURIComponent(
      "Halo, saya ingin bertanya tentang produk " +
        product.name +
        ",\n\n" +
        "(isi pesan kamu disini)"
    )
    window.open(`https://wa.me/6281224086200?text=${message}`, "_blank")
  }

  const descriptionLimit = 150
  const shortDescription =
    product.description && product.description.length > descriptionLimit
      ? product.description.substring(0, descriptionLimit) + "..."
      : product.description || ""

  const displayDescriptionHtml = {
    __html: isDescriptionExpanded ? (product.description || "") : shortDescription,
  }

  return (
    <div className="min-h-screen bg-gray-200 relative pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="w-full px-4 py-2">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-md font-semibold">Detail Produk</h1>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6">
        {/* Product Images and Info in One Card */}
        <div className="mx-auto">
          <Card className="bg-white mb-6">
            <CardContent className="p-0">
              {/* Product Images (main image and navigation) */}
              <div className="relative mb-4 pt-7">
                {/* Image Container - Mengatur ukuran gambar dan menengahkan */}
                <div className="relative aspect-square w-64 mx-auto">
                  <Image
                    src={productImages[selectedImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg overflow-hidden"
                  />
                </div>

                {/* Navigation Buttons (Panah) */}
                {productImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 z-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 z-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 px-4 mb-4">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200"
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
              )}

              {/* Garis Pemisah Tambahan */}
              <div className="border-b border-gray-200 mx-6 mb-1"></div>

              {/* Product Info */}
              <div className="p-6">
                <h1 className="text-lg font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-2">
                  {product.is_featured && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="mr-1 h-3 w-3" />
                      Unggulan
                    </Badge>
                  )}
                  {product.is_best_seller && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Terlaris
                    </Badge>
                  )}
                  {product.category && (
                    <Badge variant="outline">{product.category.name}</Badge>
                  )}
                  <Badge variant={totalStock > 0 ? "secondary" : "destructive"} className="gap-1">
                    <Package className="h-3 w-3" />
                    {totalStock > 0 ? `Stok Tersedia (${totalStock})` : "Stok Habis"}
                  </Badge>
                </div>

                {/* Price Display with Discount */}
                <div className="mb-4">
                  {hasDiscount ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-blue-600">
                          Rp {discountedPrice.toLocaleString()}
                        </p>
                        {product.discount_percentage && (
                          <Badge variant="destructive" className="text-xs">
                            -{product.discount_percentage}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-through">
                        Rp {basePrice.toLocaleString()}
                      </p>
                      {product.discount_end_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Diskon berakhir pada {new Date(product.discount_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-blue-600">
                      Rp {basePrice.toLocaleString()}
                    </p>
                  )}
                </div>

                {product.rating && product.rating > 0 && product.reviewCount ? (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({(product.rating || 0).toFixed(1)} dari {product.reviewCount} ulasan)
                    </span>
                  </div>
                ) : null}
                
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-md font-semibold mb-2 text-gray-800">Deskripsi</h3>
                    <div
                      className="text-gray-600 mb-0 text-sm prose max-w-none"
                    dangerouslySetInnerHTML={displayDescriptionHtml}
                  />
                  {product.description && product.description.length > descriptionLimit && (
                    <button
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                        className="text-blue-600 hover:underline text-sm font-medium mt-2"
                    >
                      {isDescriptionExpanded ? "Tutup" : "Baca Selengkapnya"}
                    </button>
                  )}
                  </div>

                  {/* Processor */}
                  <div>
                    <h3 className="text-md font-semibold mb-2 text-gray-800">Processor</h3>
                    <p className="text-gray-600 text-sm">
                    {product.processor}
                  </p>
                  </div>

                  {/* RAM and SSD Options */}
                  {(product.ramOptions && product.ramOptions.length > 0) || (product.ssdOptions && product.ssdOptions.length > 0) ? (
                    <div>
                      <h3 className="text-md font-semibold mb-2 text-gray-800">Opsi Konfigurasi</h3>
                      <div className="space-y-3">
                        {product.ramOptions && product.ramOptions.length > 0 && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium w-16 pt-1">RAM:</span>
                            <div className="flex flex-wrap gap-2">
                              {product.ramOptions.map((ram: string, index: number) => (
                                <Badge key={index} variant="outline" className="font-mono">{ram}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.ssdOptions && product.ssdOptions.length > 0 && (
                           <div className="flex items-start gap-2">
                             <span className="text-sm font-medium w-16 pt-1">SSD:</span>
                             <div className="flex flex-wrap gap-2">
                              {product.ssdOptions.map((ssd: string, index: number) => (
                                <Badge key={index} variant="outline" className="font-mono">{ssd}</Badge>
                              ))}
                             </div>
                           </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Specifications */}
                  {product.specs && product.specs.length > 0 && (
                     <div>
                       <h3 className="text-md font-semibold mb-2 text-gray-800">Spesifikasi Detail</h3>
                        <div className="space-y-1 text-sm">
                          {product.specs.map((spec: string, index: number) => {
                      const trimmedSpec = spec.trim()
                      const isSubItem =
                        trimmedSpec.match(/^(\d|\-|\s{2,})/) ||
                        trimmedSpec.startsWith("-")

                      return (
                        <p
                          key={index}
                                className={`text-gray-600 ${
                            isSubItem ? "pl-4" : ""
                          }`}
                        >
                          {isSubItem
                            ? `- ${trimmedSpec.replace(/^(\s*[\-\d])?\s*/, "")}`
                            : `• ${trimmedSpec}`}
                        </p>
                      )
                    })}
                  </div>
                     </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Rekomendasi Untukmu</h2>
              </div>
              <ScrollableProductList products={recommendedProducts} id="recommended-products-scroll" />
            </section>
          )}
        </div>
      </main>

      {/* Fixed Action Buttons at Bottom - full width */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-4 z-20 lg:hidden">
        <div className="container-responsive flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 w-12 h-12 rounded-full"
            onClick={handleAskAdmin}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-full shadow-lg"
            onClick={handleOrderNow}
            disabled={totalStock === 0}
          >
            {totalStock > 0 ? "Pesan Sekarang" : "Stok Habis"}
          </Button>
        </div>
      </div>

      {/* Configure Product Slide Up */}
      <ConfigureProduct
        product={product}
        isOpen={showConfigure}
        onClose={() => setShowConfigure(false)}
      />
    </div>
  )
} 