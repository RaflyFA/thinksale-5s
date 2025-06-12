// app/page.tsx
"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import ScrollableProductList from "@/components/scrollable-product-list"
import ScrollToTopButton from "@/components/scroll-to-top-button"
import { products, categories, featuredProduct } from "@/lib/data"
import { useState, useEffect, useMemo } from "react"

export default function HomePage() {
  const thinkpadProducts = products.filter((product) => product.category === "thinkpad")
  const dellProducts = products.filter((product) => product.category === "dell").slice(0, 3)

  const featuredDisplayProducts = products.filter((product) => product.id !== "4").slice(0, 2)

  const recommendedDisplayProducts = products.filter((product) => product.id !== "4").slice(0, 3)

  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return []
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.processor.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm, products])

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

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-200 relative">
      {/* Header */}
      <header
        className={`bg-white sticky top-0 z-10 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}
      >
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">ThinkSale</h1>

          {/* Search Bar */}
          <div className="relative flex-grow max-w-md ml-4 md:ml-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari Produk"
              className="pl-10 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="w-full space-y-8">
        {/* Bagian untuk Menampilkan Hasil Pencarian */}
        {searchTerm && (
          <section className="px-4 py-6">
            <h2 className="text-xl font-bold mb-4">Hasil Pencarian untuk "{searchTerm}"</h2>
            {filteredProducts.length > 0 ? (
              <ScrollableProductList products={filteredProducts} id="search-results-scroll" />
            ) : (
              <p className="text-gray-600">Tidak ada produk yang cocok dengan pencarian Anda.</p>
            )}
          </section>
        )}

        {/* Jika tidak ada hasil pencarian, tampilkan bagian-bagian utama */}
        {!searchTerm && (
          <>
            {/* Banner - Full width */}
            <div className="w-full pt-6">
              <div className="bg-white px-6 mx-4 rounded-lg shadow-lg">
                <div className="flex flex-row h-72">
                  <div className="flex-1 pr-6 flex flex-col justify-center">
                    <h2 className="text-xl font-bold mb-3 featuredProduct">{featuredProduct.title}</h2>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{featuredProduct.description}</p>
                    <Button
                      onClick={() => scrollToSection("produk-unggulan")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-fit transition-all duration-300 ease-in-out"
                    >
                      Lihat Produk
                    </Button>
                  </div>
                  <div className="w-1/3 h-full pt-12">
                    <Image
                      src={featuredProduct.image || "/putih 1.png"}
                      alt={featuredProduct.title}
                      width={150}
                      height={200}
                      className=" object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories - dengan smooth scroll yang lebih baik */}
            <section className="px-4">
              <h2 className="text-xl font-bold mb-4">Kategori</h2>
              <div className="grid grid-cols-2 gap-4 items-stretch">
                <button
                  onClick={() => scrollToSection("produk-thinkpad")}
                  className="text-left transition-transform duration-300 ease-in-out hover:scale-100 h-[120px]"
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                      <Image
                        src={categories[0].image || "/putih 1.png"}
                        alt={categories[0].name}
                        width={60}
                        height={60}
                        className="mx-auto mb-2"
                      />
                      <p className="font-medium">{categories[0].name}</p>
                    </CardContent>
                  </Card>
                </button>
                <button
                  onClick={() => scrollToSection("produk-dell")}
                  className="text-left transition-transform duration-300 ease-in-out hover:scale-100 h-[120px]"
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                      <Image
                        src={categories[1].image || "/Dell Latitude 7490 i5 gen 8.png" || "/placeholder.svg"}
                        alt={categories[1].name}
                        width={60}
                        height={60}
                        className="mx-auto mb-2"
                      />
                      <p className="font-medium">{categories[1].name}</p>
                    </CardContent>
                  </Card>
                </button>
              </div>
            </section>

            {/* Sections dengan smooth scroll yang lebih baik - PRODUK UNGGULAN*/}
            <section id="produk-unggulan" className="scroll-mt-24">
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">Produk Unggulan</h2>
              </div>
              <div className="px-4">
                {" "}
                {/* MENAMBAHKAN px-4 DI SINI */}
                <ScrollableProductList products={featuredDisplayProducts} id="produk-unggulan-scroll" />
              </div>
            </section>

            {/* Recommended Products */}
            <section className="scroll-mt-20">
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">Rekomendasi Untukmu</h2>
              </div>
              <div className="px-4">
                {" "}
                {/* MENAMBAHKAN px-4 DI SINI */}
                <ScrollableProductList products={recommendedDisplayProducts} id="rekomendasi-scroll" />
              </div>
            </section>

            {/* ThinkPad Products */}
            <section id="produk-thinkpad" className="scroll-mt-20">
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">Produk ThinkPad</h2>
                <Button
                  variant="link"
                  className="text-blue-600 hover:underline p-0"
                  onClick={() =>
                    document.getElementById("thinkpad-scroll")?.scrollTo({ left: 1000, behavior: "smooth" })
                  }
                >
                  Lihat Semua
                </Button>
              </div>
              <div className="px-4">
                {" "}
                <ScrollableProductList products={thinkpadProducts} id="thinkpad-scroll" />
              </div>
            </section>

            {/* Dell Products */}
            <section id="produk-dell" className="scroll-mt-20 pb-8">
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">Produk Dell</h2>
              </div>
              <div className="px-4">
                {" "}
                {/* MENAMBAHKAN px-4 DI SINI */}
                <ScrollableProductList products={dellProducts} id="dell-scroll" />
              </div>
            </section>
          </>
        )}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  )
}
