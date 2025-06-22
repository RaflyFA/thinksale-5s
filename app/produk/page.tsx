"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import PageLayout from "@/components/layout/page-layout"
import ProductCard from "@/components/ui/product-card"
import SectionHeader from "@/components/ui/section-header"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"
import EmptyState from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { cn } from "@/lib/utils/cn"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("kategori")

  const [activeCategory, setActiveCategory] = useState<string>(categoryFilter || "semua")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch data from database
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useProducts()

  const { 
    data: categories, 
    isLoading: categoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories 
  } = useCategories()

  // Create categories array with counts
  const categoryFilters = useMemo(() => {
    if (!products) return []
    
    return [
      { id: "semua", name: "Semua Produk", count: products.length },
      ...(categories?.map(category => ({
        id: category.slug,
        name: category.name,
        count: products.filter((p) => p.category.slug === category.slug).length
      })) || [])
    ]
  }, [products, categories])

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = products

    // Filter by category
    if (activeCategory !== "semua") {
      filtered = filtered.filter((product) => product.category.slug === activeCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.description.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    return filtered
  }, [activeCategory, searchTerm, products, categories])

  // Loading states
  const isLoading = productsLoading || categoriesLoading
  const hasError = productsError || categoriesError

  if (isLoading) {
    return (
      <PageLayout className="bg-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </PageLayout>
    )
  }

  if (hasError) {
    return (
      <PageLayout className="bg-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorState 
            title="Gagal Memuat Produk"
            message="Terjadi kesalahan saat memuat data produk. Silakan coba lagi."
            onRetry={() => {
              refetchProducts()
              refetchCategories()
            }}
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout searchTerm={searchTerm} onSearchChange={setSearchTerm} className="bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <SectionHeader
          title="Semua Produk"
          align="center"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4">
          {categoryFilters.map((category) => (
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
              {activeCategory !== "semua" && ` dalam kategori ${categoryFilters.find((c) => c.id === activeCategory)?.name}`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDiscount={true} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Tidak ada produk ditemukan"
            description="Coba ubah filter atau kata kunci pencarian Anda"
            action={{
              label: "Lihat Semua Produk",
              onClick: () => {
                setSearchTerm("")
                setActiveCategory("semua")
              }
            }}
          />
        )}

        {/* Category Sections - Only show when specific category is selected (not "semua") */}
        {!searchTerm && activeCategory !== "semua" && categories && categories.length > 0 && (
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryProducts = products?.filter((product) => product.category.slug === category.slug).slice(0, 4) || []
              
              if (categoryProducts.length === 0) return null
              
              return (
                <section key={category.id}>
                  <SectionHeader
                    title={`Koleksi ${category.name}`}
                    description={`Laptop ${category.name} dengan kualitas terbaik`}
                    action={{
                      label: `Lihat Semua ${category.name}`,
                      onClick: () => setActiveCategory(category.slug),
                    }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} showDiscount={true} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
