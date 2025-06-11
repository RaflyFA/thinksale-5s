import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-2 sm:p-3">
          <div className="aspect-square mb-2 sm:mb-3">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg"
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
            />
          </div>
          <h3 className="font-bold text-xs sm:text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-600 mb-1 truncate">{product.processor}</p>
          <p className="text-xs text-gray-600 mb-1 truncate">RAM: {product.ramOptions.join(", ")}</p>
          <p className="text-xs text-gray-600 mb-2 truncate">SSD: {product.ssdOptions.join(", ")}</p>
          <p className="font-bold text-blue-600 text-xs sm:text-sm">Rp {product.priceRange}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
