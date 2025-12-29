"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Truck, Shield, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import PageLayout from "@/components/layout/page-layout"
import ProductCard from "@/components/ui/product-card"
import SectionHeader from "@/components/ui/section-header"
import { products, categories, featuredProduct } from "@/lib/data"
import { cn } from "@/lib/utils/cn"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Separate featured and best seller products
  const featuredProducts = products.slice(0, 4) // First 4 products
  const bestSellerProducts = products.slice(4, 8) // Next 4 products

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return []

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.processor.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm])

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

  return (
    <PageLayout searchTerm={searchTerm} onSearchChange={setSearchTerm} className="bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-16 ">
        {/* Search Results */}
        {searchTerm && (
          <section className="py-8">
            <SectionHeader
              title={`Hasil Pencarian untuk "${searchTerm}"`}
              description={`Ditemukan ${filteredProducts.length} produk`}
            />

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Tidak ada produk yang cocok dengan pencarian Anda.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Lihat Semua Produk
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Main Content - Only show when not searching */}
        {!searchTerm && (
          <>
            {/* Hero Banner */}
            <section className="py-8">
              <div className="text-black rounded-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center lg">
                  <div className="flex-1 py-16 ">
                    <h1 className="text-3xl lg:text-5xl lg:leading-[1.2] lg:mr-6 font-bold mb-8">{featuredProduct.title}</h1>
                    <p className="text-lg lg:text-xl mb-6 opacity-90 leading-relaxed">{featuredProduct.description}</p>
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
                  <div className="flex-1 lg:ml-16 lg:mr-5 shadow-2xl rounded-3xl">
                    <Image
                      src={featuredProduct.image || "/placeholder.svg"}
                      alt={featuredProduct.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain rounded-3xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map(({ icon: Icon, title, description, color }) => (
                  <div key={title} className="text-center p-6">
                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", color)}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="py-12">
              <SectionHeader title="Kategori Produk" align="center" className="lg:pb-10" />

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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {bestSellerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  )
}
