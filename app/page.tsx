"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Truck, Shield, Headphones, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import PageLayout from "@/components/layout/page-layout"
import ProductCard from "@/components/ui/product-card"
import SectionHeader from "@/components/ui/section-header"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"
import EmptyState from "@/components/ui/empty-state"
import { useFeaturedProducts, useBestSellerProducts, useSearchProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { useSettings } from "@/lib/providers/settings-provider"
import { cn } from "@/lib/utils/cn"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { settings } = useSettings()

  // Fetch data from database
  const { 
    data: featuredProducts, 
    isLoading: featuredLoading, 
    error: featuredError,
    refetch: refetchFeatured 
  } = useFeaturedProducts()

  const { 
    data: bestSellerProducts, 
    isLoading: bestSellerLoading, 
    error: bestSellerError,
    refetch: refetchBestSeller 
  } = useBestSellerProducts()

  const { 
    data: categories, 
    isLoading: categoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories 
  } = useCategories()

  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    error: searchError,
    refetch: refetchSearch 
  } = useSearchProducts(searchTerm)

  // Dynamic hero content based on settings
  const heroContent = useMemo(() => {
    const storeName = settings?.general?.store_name || "ThinkSale"
    return {
      title: `Laptop Terpercaya dari ${storeName}`,
      description: settings?.general?.store_description || "Koleksi lengkap laptop ThinkPad dan Dell dengan kualitas terjamin dan harga terbaik. Dapatkan laptop impian Anda sekarang!",
      image: settings?.general?.hero_image
    }
  }, [settings])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/produk?kategori=${categorySlug}`)
  }

  const features = [
    {
      icon: Truck,
      title: "Pengiriman Gratis",
      description: "Gratis ongkir untuk pembelian di atas Rp 3.000.000",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Shield,
      title: "Garansi Resmi",
      description: "Semua produk bergaransi resmi dari distributor",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Tim support siap membantu Anda kapan saja",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  // Loading states
  const isLoading = featuredLoading || bestSellerLoading || categoriesLoading
  const hasError = featuredError || bestSellerError || categoriesError

  return (
    <PageLayout searchTerm={searchTerm} onSearchChange={setSearchTerm} className="bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-16 ">
        {/* Search Results */}
        {searchTerm && (
          <section className="py-8">
            <SectionHeader
              title={`Hasil Pencarian untuk "${searchTerm}"`}
              description={`Ditemukan ${searchResults?.length || 0} produk`}
            />

            {searchLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : searchError ? (
              <ErrorState 
                title="Gagal Mencari Produk"
                message="Terjadi kesalahan saat mencari produk. Silakan coba lagi."
                onRetry={refetchSearch}
              />
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} showDiscount={true} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Tidak Ada Hasil Pencarian"
                description={`Tidak ada produk yang cocok dengan pencarian "${searchTerm}". Coba kata kunci lain atau lihat semua produk kami.`}
                icon={Search}
                action={{
                  label: "Lihat Semua Produk",
                  onClick: () => setSearchTerm("")
                }}
              />
            )}
          </section>
        )}

        {/* Main Content - Only show when not searching */}
        {!searchTerm && (
          <>
            {/* Hero Banner */}
            <section className="pt-8 pb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="flex-1 p-8 lg:p-12 text-white">
                    <h1 className="text-3xl lg:text-5xl lg:leading-[1.2] font-bold mb-8">{heroContent.title}</h1>
                    <p className="text-lg lg:text-xl mb-6 opacity-90 leading-relaxed">{heroContent.description}</p>
                    
                    
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => scrollToSection("produk-unggulan")}
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full"
                        size="lg"
                      >
                        Lihat Koleksi
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 p-8">
                    <Image
                      src={heroContent.image || "/placeholder.svg"}
                      alt={heroContent.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-0">
              <div className="grid grid-cols-3 gap-4">
                {features.map(({ icon: Icon, title, description, color }) => (
                  <div
                    key={title}
                    className="flex h-full flex-col items-center justify-start p-4 text-center"
                  >
                    <div
                      className={cn("mb-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full", color)}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-gray-800">{title}</h3>
                    <p className="hidden sm:block text-xs leading-relaxed text-gray-600">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="pt-0 pb-12">
              <SectionHeader title="Kategori Produk" align="center" className="lg:pb-10" />

              {categoriesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : categoriesError ? (
                <ErrorState 
                  title="Gagal Memuat Kategori"
                  message="Terjadi kesalahan saat memuat kategori produk."
                  onRetry={refetchCategories}
                />
              ) : categories && categories.length > 0 ? (
                <div className="md:max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                        <div className="aspect-[16/9] relative">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 text-white">
                            <h3 className="text-sm lg:text-2xl font-bold mb-0 lg:mb-2">{category.name}</h3>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState 
                  title="Belum Ada Kategori"
                  description="Belum ada kategori produk yang tersedia saat ini."
                />
              )}
            </section>
            
            <hr className="my-16 border-gray-400 w-full max-w-7xl mx-auto" />

            {/* Featured Products */}
            <section id="produk-unggulan" className="py-8">
              <SectionHeader
                title="Produk Unggulan"
                description="Koleksi laptop terbaik dengan spesifikasi unggulan"
                action={{
                  label: "Lihat Semua",
                  href: "/produk",
                }}
              />

              {featuredLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : featuredError ? (
                <ErrorState 
                  title="Gagal Memuat Produk Unggulan"
                  message="Terjadi kesalahan saat memuat produk unggulan."
                  onRetry={refetchFeatured}
                />
              ) : featuredProducts && featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showDiscount={true} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="Belum Ada Produk Unggulan"
                  description="Belum ada produk unggulan yang tersedia saat ini."
                />
              )}
            </section>

            <hr className="my-16 border-gray-400 w-full max-w-7xl mx-auto" />

            {/* Best Sellers */}
            <section className="py-8">
              <SectionHeader
                title="Produk Terlaris"
                description="Laptop pilihan favorit pelanggan kami"
                action={{
                  label: "Lihat Semua",
                  href: "/produk",
                }}
              />

              {bestSellerLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : bestSellerError ? (
                <ErrorState 
                  title="Gagal Memuat Produk Terlaris"
                  message="Terjadi kesalahan saat memuat produk terlaris."
                  onRetry={refetchBestSeller}
                />
              ) : bestSellerProducts && bestSellerProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {bestSellerProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showDiscount={true} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="Belum Ada Produk Terlaris"
                  description="Belum ada produk terlaris yang tersedia saat ini."
                />
              )}
            </section>
          </>
        )}
      </div>
    </PageLayout>
  )
}
