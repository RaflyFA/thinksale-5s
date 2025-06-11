"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import ScrollableProductList from "@/components/scrollable-product-list"
import ScrollToTopButton from "@/components/scroll-to-top-button"
import { products, categories, featuredProduct } from "@/lib/data"

export default function HomePage() {
  // Grup produk berdasarkan kategori
  const thinkpadProducts = products.filter((product) => product.category === "thinkpad").slice(0, 3)
  const dellProducts = products.filter((product) => product.category === "dell").slice(0, 3)
  const recommendedProducts = products.slice(0, 3)

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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center w-full">ThinkSale</h1>
            {/* Admin Access Button - Hidden on mobile, visible on larger screens */}
            <Link href="/admin/add-product" className="absolute right-4 top-4 hidden sm:block">
              <Button variant="ghost" size="sm" className="text-xs">
                Admin
              </Button>
            </Link>
          </div>

          {/* Search Bar - Responsive width */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Cari Produk" className="pl-10 bg-gray-100 border-none w-full" />
          </div>
        </div>
      </header>

      <main className="w-full space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Featured Banner - Responsive layout */}
        <div className="w-full pt-4 sm:pt-6">
          <div className="bg-white">
            <div className="flex flex-col sm:flex-row h-auto sm:h-48 lg:h-56">
              <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-0 flex flex-col justify-center order-2 sm:order-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 leading-tight">{featuredProduct.title}</h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">{featuredProduct.description}</p>
                <Button
                  onClick={() => scrollToSection("produk-unggulan")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-fit transition-all duration-300 ease-in-out"
                >
                  Lihat Produk osoosssssssssssssssssssss
                </Button>
              </div>
              <div className="w-full sm:w-1/2 lg:w-2/5 h-48 sm:h-full order-1 sm:order-2">
                <Image
                  src={featuredProduct.image || "/placeholder.svg"}
                  alt={featuredProduct.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories - Responsive grid */}
        <section className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">Kategori</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => scrollToSection("produk-thinkpad")}
              className="text-left transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Image
                    src={categories[0].image || "/placeholder.svg"}
                    alt={categories[0].name}
                    width={80}
                    height={80}
                    className="mx-auto mb-2 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                  />
                  <p className="font-medium text-sm sm:text-base">{categories[0].name}</p>
                </CardContent>
              </Card>
            </button>
            <button
              onClick={() => scrollToSection("produk-dell")}
              className="text-left transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Image
                    src={categories[1].image || "/placeholder.svg"}
                    alt={categories[1].name}
                    width={80}
                    height={80}
                    className="mx-auto mb-2 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                  />
                  <p className="font-medium text-sm sm:text-base">{categories[1].name}</p>
                </CardContent>
              </Card>
            </button>
          </div>
        </section>

        {/* Product Sections - Responsive spacing and layout */}
        <section id="produk-unggulan" className="scroll-mt-20 sm:scroll-mt-24">
          <div className="flex justify-between items-center mb-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Produk Unggulan</h2>
            <Button
              variant="link"
              className="text-blue-600 hover:underline p-0 text-sm sm:text-base"
              onClick={() =>
                document.getElementById("produk-unggulan-scroll")?.scrollTo({ left: 1000, behavior: "smooth" })
              }
            >
              Lihat Semua
            </Button>
          </div>
          <ScrollableProductList products={recommendedProducts} id="produk-unggulan-scroll" />
        </section>

        <section className="scroll-mt-20">
          <div className="flex justify-between items-center mb-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Rekomendasi Untukmu</h2>
            <Button
              variant="link"
              className="text-blue-600 hover:underline p-0 text-sm sm:text-base"
              onClick={() =>
                document.getElementById("rekomendasi-scroll")?.scrollTo({ left: 1000, behavior: "smooth" })
              }
            >
              Lihat Semua
            </Button>
          </div>
          <ScrollableProductList products={recommendedProducts} id="rekomendasi-scroll" />
        </section>

        <section id="produk-thinkpad" className="scroll-mt-20">
          <div className="flex justify-between items-center mb-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Produk ThinkPad</h2>
            <Button
              variant="link"
              className="text-blue-600 hover:underline p-0 text-sm sm:text-base"
              onClick={() => document.getElementById("thinkpad-scroll")?.scrollTo({ left: 1000, behavior: "smooth" })}
            >
              Lihat Semua
            </Button>
          </div>
          <ScrollableProductList products={thinkpadProducts} id="thinkpad-scroll" />
        </section>

        <section id="produk-dell" className="scroll-mt-20 pb-8">
          <div className="flex justify-between items-center mb-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Produk Dell</h2>
            <Button
              variant="link"
              className="text-blue-600 hover:underline p-0 text-sm sm:text-base"
              onClick={() => document.getElementById("dell-scroll")?.scrollTo({ left: 1000, behavior: "smooth" })}
            >
              Lihat Semua
            </Button>
          </div>
          <ScrollableProductList products={dellProducts} id="dell-scroll" />
        </section>
      </main>

      {/* Scroll to Top Button - Responsive positioning */}
      <ScrollToTopButton />
    </div>
  )
}
