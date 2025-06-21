"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"
import { useCart } from "@/lib/cart/cart-context"
import { cn } from "@/lib/utils/cn"

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { addItem } = useCart()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/admin/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Produk tidak ditemukan")
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].id)
        }
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ErrorState 
          title="Produk tidak ditemukan"
          message={error || "Produk ini tidak tersedia."}
          action={{ label: "Kembali", onClick: () => router.back() }}
        />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants && product.variants.length > 0) return
    const variant = product.variants?.find((v: any) => v.id === selectedVariant)
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: variant ? variant.price : product.price_range,
      variant: variant ? { ram: variant.ram, ssd: variant.ssd, id: variant.id } : undefined,
      category: product.category,
      quantity: 1,
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Images */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-contain" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
        </div>
        {/* Thumbnails if multiple images */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {product.images.map((img: string, idx: number) => (
              <div key={idx} className="w-16 h-16 relative rounded overflow-hidden border">
                <Image src={img} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-gray-500 mb-1">Kategori: {product.category?.name}</div>
          <div className="text-gray-700 mb-2">{product.processor}</div>
          {product.rating && (
            <div className="text-yellow-500 font-semibold mb-2">Rating: {product.rating} / 5</div>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {product.variants && product.variants.length > 0
              ? `Rp${product.variants[0].price.toLocaleString()}`
              : product.price_range || "-"}
          </div>
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="font-medium">Pilih Varian:</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: any) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant === variant.id ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={cn(
                      "rounded-full px-4 py-2",
                      selectedVariant === variant.id && "ring-2 ring-blue-500"
                    )}
                  >
                    {variant.ram} / {variant.ssd} - Rp{variant.price.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button
          size="lg"
          className="w-full md:w-auto"
          onClick={handleAddToCart}
          disabled={product.variants && product.variants.length > 0 && !selectedVariant}
        >
          Tambah ke Keranjang
        </Button>
        <div>
          <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
        {product.specs && product.specs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Spesifikasi</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {product.specs.map((spec: string, idx: number) => (
                <li key={idx}>{spec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 