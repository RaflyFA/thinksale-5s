"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import PageLayout from "@/components/layout/page-layout"
import ProductCard from "@/components/ui/product-card"
import SectionHeader from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"
import { cn } from "@/lib/utils/cn"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("kategori")

  const [activeCategory, setActiveCategory] = useState<string>(categoryFilter || "semua")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    { id: "semua", name: "Semua Produk", count: products.length },
    { id: "thinkpad", name: "ThinkPad", count: products.filter((p) => p.category === "thinkpad").length },
    { id: "dell", name: "Dell", count: products.filter((p) => p.category === "dell").length },
  ]

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (activeCategory !== "semua") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.processor.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.description.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    return filtered
  }, [activeCategory, searchTerm])

  return (
    <PageLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <SectionHeader
          title="Semua Produk"
          description="Temukan laptop impian Anda dari koleksi lengkap kami"
          align="center"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-6 py-3 rounded-full transition-all duration-300",
                activeCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:border-blue-500 hover:text-blue-600",
              )}
            >
              {category.name}
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </Button>
          ))}
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="text-center py-4">
            <p className="text-gray-600">
              Menampilkan {filteredProducts.length} produk untuk "{searchTerm}"
              {activeCategory !== "semua" && ` dalam kategori ${categories.find((c) => c.id === activeCategory)?.name}`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian Anda</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Hapus Pencarian
                </Button>
                <Button variant="outline" onClick={() => setActiveCategory("semua")}>
                  Lihat Semua Kategori
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Category Sections - Only show when no search term and "semua" category */}
        {!searchTerm && activeCategory === "semua" && (
          <div className="space-y-16">
            {/* ThinkPad Section */}
            <section>
              <SectionHeader
                title="Koleksi ThinkPad"
                description="Laptop bisnis terpercaya dengan performa tinggi"
                action={{
                  label: "Lihat Semua ThinkPad",
                  onClick: () => setActiveCategory("thinkpad"),
                }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter((product) => product.category === "thinkpad")
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </section>

            {/* Dell Section */}
            <section>
              <SectionHeader
                title="Koleksi Dell"
                description="Laptop modern dengan teknologi terdepan"
                action={{
                  label: "Lihat Semua Dell",
                  onClick: () => setActiveCategory("dell"),
                }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter((product) => product.category === "dell")
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
