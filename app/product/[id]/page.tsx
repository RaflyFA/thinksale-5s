"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import ConfigureProduct from "@/components/configure-product"; // Pastikan ini diimpor dengan benar
import { products } from "@/lib/data";
import { useParams } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showConfigure, setShowConfigure] = useState(false);

  // Dapatkan ID dari URL menggunakan useParams hook
  const { id } = useParams();

  // Temukan produk berdasarkan ID
  // Gunakan `id` dari useParams, pastikan itu string
  const productId = Array.isArray(id) ? id[0] : id; // Handle case where id might be array
  const product = products.find((p) => p.id === productId) || products[0]; // Gunakan productId

  // Produk rekomendasi (3 produk acak selain produk saat ini)
  const recommendedProducts = products
    .filter((p) => p.id !== productId)
    .slice(0, 3); // Mengubah dari 2 menjadi 3

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleOrderNow = () => {
    setShowConfigure(true);
  };

  const handleAskAdmin = () => {
    const message = encodeURIComponent(
      "Halo, saya ingin bertanya tentang produk " +
        product.name +
        ",\n\n" +
        "(isi pesan kamu disini)"
    );
    window.open(`https://wa.me/6281224086200?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Detail Produk</h1>
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
                  {" "}
                  {/* Gambar kecil dan tengah */}
                  <Image
                    src={
                      product.images[selectedImageIndex] || "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg overflow-hidden"
                  />
                </div>

                {/* Navigation Buttons (Panah) */}
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
              </div>

              {/* Thumbnail Images */}
              <div className="flex justify-center gap-2 px-4 mb-4 ">
                {product.images.map((image, index) => (
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

              {/* Garis Pemisah Tambahan */}
              <div className="border-b border-gray-200 mx-6 mb-1"></div>

              {/* Product Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  Rp {product.priceRange}
                </p>

                <div className="mb-6">
                  <p className="font-medium mb-2">{product.description}</p>
                  <p className="text-gray-600 mb-4">{product.processor}</p>

                  <div className="space-y-1">
                    {product.specs.map((spec, index) => {
                      const trimmedSpec = spec.trim();
                      const isSubItem =
                        trimmedSpec.match(/^(\d|\-|\s{2,})/) ||
                        trimmedSpec.startsWith("-");

                      return (
                        <p
                          key={index}
                          className={`text-sm text-gray-600 ${
                            isSubItem ? "pl-4" : ""
                          }`}
                        >
                          {isSubItem
                            ? `- ${trimmedSpec.replace(/^(\s*[\-\d])?\s*/, "")}`
                            : `• ${trimmedSpec}`}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Products */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Rekomendasi Untukmu</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Action Buttons at Bottom - full width */}
      <div className="fixed bottom-0 left-0 right-0  bg-white border-t p-4 z-20">
        <div className="max-w-[39rem] mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={handleAskAdmin}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleOrderNow}
          >
            Pesan Sekarang
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
  );
}
