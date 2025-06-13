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
      <Card className="cursor-pointer hover:shadow-lg min-w-28 w-44 h-80 flex-shrink-0 snap-start transition-transform duration-200 hover:scale-100 flex flex-col justify-between">
        <CardContent className="p-3 flex flex-col h-full">
          <div className="aspect-square mb-3">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-bold text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2">{product.processor}</p>
              <p className="text-xs text-gray-600 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                RAM: {product.ramOptions.join(", ")}
              </p>
              <p className="text-xs text-gray-600 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                SSD: {product.ssdOptions.join(", ")}
              </p>
            </div>
            <p className="font-bold text-blue-600 text-sm mt-auto">
              Rp {product.priceRange}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
