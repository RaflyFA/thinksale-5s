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

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  showRating?: boolean;
  showDiscount?: boolean;
  className?: string;
  imageAspectRatio?: "square" | "portrait" | "landscape";
  id?: string;
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
  // Pastikan `product.variants` ada dan memiliki setidaknya satu varian
  const basePrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].price // Ambil harga varian pertama sebagai harga dasar
      : 0; // Fallback jika tidak ada varian

  // Hitung originalPrice (harga sebelum diskon) dari harga dasar.
  // Anda bisa menggunakan logika yang lebih kompleks di sini jika perlu,
  // misalnya harga tertinggi dari semua varian, atau harga yang sudah ditentukan.
  // Saat ini, kita akan membuat originalPrice lebih tinggi dari basePrice
  // sebagai simulasi harga sebelum diskon.
  // Contoh: Tambahkan 20% dari basePrice untuk originalPrice
  const originalPrice = basePrice > 0 ? Math.round(basePrice * 1.2) : 0; // Dibulatkan untuk angka yang lebih bersih

  // Calculate discount percentage (gunakan yang sudah ada, ini hanya simulasi visual)
  const discountPercentage = Math.floor(Math.random() * 20) + 10; // 10-30% discount

  const rating = 4.8;
  const reviewCount = Math.floor(Math.random() * 200) + 50;

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  // Helper function to format options (from previous solution)
  const formatOptions = (options: string[]): string => {
    if (!options || options.length === 0) return "N/A";
    if (options.length === 1) return options[0];
    return `${options[0]} - ${options[options.length - 1]}`;
  };

  const formattedRamOptions = formatOptions(product.ramOptions);
  const formattedSsdOptions = formatOptions(product.ssdOptions);

  // Perhitungan nilai hemat
  const savingsAmount = originalPrice - basePrice; // Selisih antara harga asli dan harga dasar varian pertama

  return (
    <Card
      id={id}
      className={cn(
        "h-full cursor-pointer group overflow-hidden bg-white",
        "lg:hover:shadow-xl lg:transition-all lg:duration-1000 lg:transform lg:hover:-translate-y-1 lg:ease-in-out",
        className
      )}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden",
            aspectRatioClasses[imageAspectRatio]
          )}
        >
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover lg:transition-transform lg:duration-500 lg:ease-in-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {showDiscount && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}

          </div>

          
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <Link
            href={`/product/${product.id}`}
            className="flex justify-between"
          >
            <h3 className="font-bold text-md mb-2 line-clamp-2 lg:group-hover:text-blue-600 lg:transition-colors leading-tight">
              {product.name}
            </h3>
            <ShoppingCart className="h-4 w-4" />
          </Link>

          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            {product.processor}
          </p>

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
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">({rating})</span>
              <span className="text-xs text-gray-400 ml-1">
                • {reviewCount} ulasan
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-baseline space-x-2">
              <p className="font-bold text-blue-600 text-lg">
                Rp {product.priceRange}
              </p>
              {showDiscount &&
                originalPrice > basePrice && ( // Tampilkan diskon hanya jika originalPrice > basePrice
                  <p className="text-xs text-gray-500 line-through">
                    Rp {originalPrice.toLocaleString("id-ID")}
                  </p>
                )}
            </div>
            {showDiscount &&
              savingsAmount > 0 && ( // Tampilkan "Hemat Rp" hanya jika ada penghematan
                <p className="text-xs text-green-600 font-medium mt-1">
                  Hemat Rp {savingsAmount.toLocaleString("id-ID")}
                </p>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
