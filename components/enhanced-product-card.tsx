/**
 * Enhanced Product Card Component
 *
 * Komponen kartu produk yang ditingkatkan dengan fitur:
 * - Hover effects yang smooth
 * - Rating display
 * - Price comparison
 * - Responsive design
 * - Accessibility features
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/lib/cart/cart-context"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

interface EnhancedProductCardProps {
  product: Product
  showAddToCart?: boolean
  showWishlist?: boolean
  className?: string
}

export default function EnhancedProductCard({
  product,
  showAddToCart = true,
  showWishlist = true,
  className = "",
}: EnhancedProductCardProps) {
  const { addItem } = useCart()
  
  // Handle both database fields and transformed fields
  const priceRange = product.priceRange || product.price_range || "0"
  const ramOptions = product.ramOptions || product.ram_options || []
  const ssdOptions = product.ssdOptions || product.ssd_options || []
  
  // Menghitung harga diskon (simulasi)
  const originalPrice = Number.parseInt(priceRange.replace(/\./g, "")) + 1000000
  const discountPercentage = Math.floor(Math.random() * 20) + 10 // 10-30% diskon

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ambil varian pertama sebagai default
    const defaultVariant = product.variants?.[0]
    if (defaultVariant) {
      addItem({
        product,
        ram: ramOptions[0] || "",
        ssd: ssdOptions[0] || "",
        price: defaultVariant.price || 0,
      })
      toast.success("Produk berhasil ditambahkan ke keranjang!")
    } else {
      // Fallback jika tidak ada varian
      addItem({
        product,
        ram: ramOptions[0] || "",
        ssd: ssdOptions[0] || "",
        price: Number.parseInt(priceRange.replace(/\./g, "")) || 0,
      })
      toast.success("Produk berhasil ditambahkan ke keranjang!")
    }
  }

  return (
    <Card
      className={`h-full cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden ${className}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden">
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discountPercentage}%
            </div>
            {showWishlist && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white h-8 w-8 rounded-full"
                aria-label="Tambah ke wishlist"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>

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
            <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{product.processor}</p>

          {/* Specifications */}
          <div className="text-xs text-gray-500 mb-3 space-y-1">
            <div className="flex justify-between">
              <span>RAM:</span>
              <span className="font-medium">{ramOptions[0] || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>SSD:</span>
              <span className="font-medium">{ssdOptions[0] || "N/A"}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">(4.8)</span>
            <span className="text-xs text-gray-400 ml-1">• 127 ulasan</span>
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-baseline space-x-2">
              <p className="font-bold text-blue-600 text-lg">Rp {priceRange}</p>
              <p className="text-xs text-gray-500 line-through">Rp {originalPrice.toLocaleString("id-ID")}</p>
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              Hemat Rp{" "}
              {(originalPrice - Number.parseInt(priceRange.replace(/\./g, ""))).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
