/**
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
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

  const originalPrice = Number.parseInt(product.priceRange.replace(/\./g, "")) + 1000000
  const discountPercentage = Math.floor(Math.random() * 20) + 10

  return (
    <Card
      className={`h-full cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden ${className}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
      
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

    
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {showAddToCart && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Tambah ke Keranjang
              </Button>
            )}
          </div>
        </div>

        
        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{product.processor}</p>

          
          <div className="text-xs text-gray-500 mb-3 space-y-1">
            <div className="flex justify-between">
              <span>RAM:</span>
              <span className="font-medium">{product.ramOptions[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>SSD:</span>
              <span className="font-medium">{product.ssdOptions[0]}</span>
            </div>
          </div>

          
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">(4.8)</span>
            <span className="text-xs text-gray-400 ml-1">• 127 ulasan</span>
          </div>

          
          <div className="mt-auto">
            <div className="flex items-baseline space-x-2">
              <p className="font-bold text-blue-600 text-lg">Rp {product.priceRange}</p>
              <p className="text-xs text-gray-500 line-through">Rp {originalPrice.toLocaleString("id-ID")}</p>
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              Hemat Rp{" "}
              {(originalPrice - Number.parseInt(product.priceRange.replace(/\./g, ""))).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
