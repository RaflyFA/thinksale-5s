import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-3">
          <div className="aspect-square mb-3">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 className="font-bold text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mb-1">{product.processor}</p>
          <p className="text-xs text-gray-600 mb-1">
            RAM: {product.ramOptions.join(", ")}
          </p>
          <p className="text-xs text-gray-600 mb-2">
            SSD: {product.ssdOptions.join(", ")}
          </p>
          <p className="font-bold text-blue-600 text-sm">
            Rp {product.priceRange}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
