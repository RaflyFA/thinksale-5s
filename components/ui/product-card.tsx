"use client"

import type React from "react"

// components/ui/product-card.tsx
/**
 * Product Card Component
 *
 * Komponen kartu produk yang konsisten dan reusable
 * Dengan design yang uniform di seluruh aplikasi
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart/cart-context"
import { toast } from "sonner"
import { isDiscountActive, getBasePrice, getDiscountedPrice } from "@/lib/utils/product-helpers"

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
  showWishlist?: boolean
  showRating?: boolean
  showDiscount?: boolean
  className?: string
  imageAspectRatio?: "square" | "portrait" | "landscape"
  id?: string
}

export default function ProductCard({
  product,
  showAddToCart = true,
  showWishlist = true,
  showRating = true,
  showDiscount = true,
  className,
  imageAspectRatio = "square",
  id,
}: ProductCardProps) {
  const { addItem } = useCart()

  const hasDiscount = isDiscountActive(product)
  const realDiscountPercentage = product.discount_percentage || 0
  const basePrice = getBasePrice(product);
  const discountedPrice = getDiscountedPrice(product);

  // Use real rating and review count from database, fallback to generated values
  const rating = product.rating || 4.8
  const reviewCount = product.reviewCount || (50 + (parseInt(product.id) % 200))

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }

  // Helper function to format options
  const formatOptions = (options: string[]): string => {
    if (!options || options.length === 0) return "N/A"
    if (options.length === 1) return options[0]
    return `${options[0]} - ${options[options.length - 1]}`
  }

  const ramOptions = product.ramOptions || product.ram_options || [];
  const ssdOptions = product.ssdOptions || product.ssd_options || [];

  const formattedRamOptions = formatOptions(ramOptions);
  const formattedSsdOptions = formatOptions(ssdOptions);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ambil varian pertama sebagai default
    const defaultVariant = product.variants?.[0]
    if (defaultVariant) {
      addItem({
        product,
        ram: product.ramOptions[0],
        ssd: product.ssdOptions[0],
        price: defaultVariant.price,
      })
      toast.success("Produk berhasil ditambahkan ke keranjang!")
    } else {
      // Fallback jika tidak ada varian
      addItem({
        product,
        ram: product.ramOptions[0] || "",
        ssd: product.ssdOptions[0] || "",
        price: Number.parseInt(product.priceRange.replace(/\./g, "")) || 0,
      })
      toast.success("Produk berhasil ditambahkan ke keranjang!")
    }
  }

  return (
    <Card
      id={id}
      className={cn(
        "h-full cursor-pointer group overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2",
        className,
      )}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Container */}
        <div className={cn("relative overflow-hidden", aspectRatioClasses[imageAspectRatio])}>
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          {/* Badges Container */}
          <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col items-start gap-1">
            {product.is_featured && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 shadow-sm backdrop-blur-sm font-medium bg-opacity-95"
              >
                <Star className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Unggulan</span>
                <span className="sm:hidden">⭐</span>
              </Badge>
            )}
            {product.is_best_seller && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 shadow-sm backdrop-blur-sm font-medium bg-opacity-95"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Terlaris</span>
                <span className="sm:hidden">🔥</span>
              </Badge>
            )}
          </div>
          {showDiscount && hasDiscount && (
            <div className="pointer-events-none absolute right-3 top-3 z-20">
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 font-bold shadow-lg px-2 sm:px-3 py-1 backdrop-blur-sm transform-gpu scale-105">
                -{realDiscountPercentage}%
              </Badge>
            </div>
          )}

          {/* Quick Actions - Muncul saat hover dengan overlay gelap */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
            {showAddToCart && (
              <div className="flex flex-col gap-3 w-full px-4">
                <Button 
                  onClick={handleAddToCart}
                  className="bg-white hover:bg-gray-100 text-gray-900 border-0 shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 px-6 py-3 rounded-full font-medium z-20 relative"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Tambah ke Keranjang
                </Button>
                <Link href={`/product/${product.id}`} className="w-full">
                  <Button 
                    variant="outline"
                    className="bg-transparent hover:bg-white/10 text-white border-white hover:border-white shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 px-6 py-3 rounded-full font-medium w-full z-20 relative"
                    size="lg"
                  >
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-md line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{product.processor}</p>

          {/* Specifications */}
          <div className="text-xs text-gray-500 mb-3 space-y-1">
            {product.ramOptions && product.ramOptions.length > 0 && (
              <div className="flex justify-between">
                <span>RAM:</span>
                <span className="font-medium">{formattedRamOptions}</span>
              </div>
            )}
            {product.ssdOptions && product.ssdOptions.length > 0 && (
              <div className="flex justify-between">
                <span>SSD:</span>
                <span className="font-medium">{formattedSsdOptions}</span>
              </div>
            )}
            {/* Stock Information */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex justify-between">
                <span>Stok:</span>
                <span className={cn(
                  "font-medium",
                  product.variants.some(v => v.stock && v.stock > 0) 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {product.variants.some(v => v.stock && v.stock > 0) ? "Tersedia" : "Habis"}
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">({rating.toFixed(1)})</span>
              <span className="text-xs text-gray-400 ml-1">• {reviewCount} ulasan</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            {hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <p className="font-bold text-blue-600 text-lg">
                    Rp {discountedPrice.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    Rp {basePrice.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="text-xs text-green-600 font-medium">
                  Hemat Rp {(basePrice - discountedPrice).toLocaleString("id-ID")}
                </p>
              </div>
            ) : (
              <div className="flex items-baseline space-x-2">
                <p className="font-bold text-blue-600 text-lg">Rp {basePrice.toLocaleString("id-ID")}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
