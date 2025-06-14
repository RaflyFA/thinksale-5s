/**
 * Home Page
 *
 * Halaman utama website ThinkSale
 * Menggunakan layout dan komponen yang konsisten
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

"use client"

import { useState, useMemo } from "react"
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

  // Filter products based on categories
  const featuredProducts = products.slice(0, 8)
  const bestSellerProducts = products.slice(0, 4)

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
    <PageLayout searchTerm={searchTerm} onSearchChange={setSearchTerm} cartItemCount={0}>
      <div className="max-w-7xl mx-auto px-4 space-y-16">
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="flex-1 p-8 lg:p-12 text-white">
                    <h1 className="text-3xl lg:text-5xl lg:leading-[1.2] font-bold mb-8 ">{featuredProduct.title}</h1>
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
                  <div className="flex-1 p-8">
                    <Image
                      src={featuredProduct.image || "/placeholder.svg"}
                      alt={featuredProduct.title}
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
              <SectionHeader
                title="Kategori Produk"
                align="center"
                className="lg:pb-10"
              />

              <div className="md:max-w-4xl mx-auto"> {/* Wrapper untuk menengahkan dan membatasi lebar */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      // Panggil scrollToSection dengan searchTerm tambahan
                      onClick={() => scrollToSection("produk-unggulan", category.name)}
                      className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300" // Kelas hover sudah dihapus
                    >
                      <div className="aspect-[16/9] relative">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300" // Kelas hover sudah dihapus
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 text-white">
                          <h3 className="text-sm lg:text-2xl font-bold mb-0 lg:mb-2">{category.name}</h3>
                          {/* category.description dihapus */}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Products */}
            <section id="produk-unggulan" className="py-12">
              <SectionHeader
                title="Produk Unggulan"
                description="Koleksi laptop terbaik dengan spesifikasi unggulan"
                action={{
                  label: "Lihat Semua",
                  href: "/products",
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Produk yang ditampilkan di sini sudah difilter oleh useMemo jika searchTerm ada */}
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  // Jika tidak ada hasil filter setelah kategori diklik, tampilkan semua featuredProducts
                  featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </section>

            {/* Best Sellers */}
            <section className="py-12">
              <SectionHeader
                title="Produk Terlaris"
                description="Laptop pilihan favorit pelanggan kami"
                action={{
                  label: "Lihat Semua",
                  href: "/products/best-sellers",
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section className="py-16">
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 lg:p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Dapatkan Penawaran Terbaik</h2>
                <p className="text-lg mb-8 opacity-90">Berlangganan newsletter kami dan dapatkan diskon hingga 20%</p>
                <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Masukkan email Anda" className="flex-1 bg-white text-gray-800" />
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8">Berlangganan</Button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  )
}
