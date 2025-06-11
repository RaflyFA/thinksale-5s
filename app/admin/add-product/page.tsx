"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    processor: "",
    description: "",
    ramOptions: "",
    ssdOptions: "",
    variants: "",
    specs: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product data:", formData)

    // Contoh format data yang dihasilkan untuk dimasukkan ke lib/data.ts
    const formattedData = `
{
  id: "${Math.random().toString(36).substr(2, 9)}",
  name: "${formData.name}",
  category: "${formData.category}",
  processor: "${formData.processor}",
  description: "${formData.description}",
  image: "/placeholder.svg?height=200&width=200",
  images: [
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
  ],
  ramOptions: [${formData.ramOptions
    .split(",")
    .map((ram) => `"${ram.trim()}"`)
    .join(", ")}],
  ssdOptions: [${formData.ssdOptions
    .split(",")
    .map((ssd) => `"${ssd.trim()}"`)
    .join(", ")}],
  priceRange: "${formData.variants.split("\n")[0].split(",")[2]?.trim() || "0"} - ${
    formData.variants.split("\n").pop()?.split(",")[2]?.trim() || "0"
  }",
  specs: [
    ${formData.specs
      .split("\n")
      .map((spec) => `"${spec.trim()}"`)
      .join(",\n    ")}
  ],
  variants: [
    ${formData.variants
      .split("\n")
      .map((variant) => {
        const [ram, ssd, price] = variant.split(",").map((v) => v.trim())
        return `{ ram: "${ram}", ssd: "${ssd}", price: ${price.replace(/\D/g, "")} }`
      })
      .join(",\n    ")}
  ]
}
    `

    console.log("Formatted data for lib/data.ts:", formattedData)
    alert("Produk berhasil ditambahkan! Lihat console untuk data yang dihasilkan.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-xl font-semibold">Tambah Produk</h1>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            {/* Product Image - Responsive */}
            <div>
              <Label className="text-gray-700 mb-2 block text-sm sm:text-base">Gambar Produk</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                  >
                    Pilih Gambar
                  </Button>
                  <p className="text-xs text-gray-500">Format: JPG, PNG. Maks 2MB</p>
                </div>
              </div>
            </div>

            {/* Form Fields - Responsive */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Nama Produk
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Lenovo ThinkPad T470s"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-300 text-base"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Kategori
                </Label>
                <Input
                  id="category"
                  type="text"
                  placeholder="Contoh: thinkpad, dell"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="border-gray-300 text-base"
                />
              </div>

              <div>
                <Label htmlFor="processor" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Processor
                </Label>
                <Input
                  id="processor"
                  type="text"
                  placeholder="Contoh: Intel Core i5 Gen 7"
                  value={formData.processor}
                  onChange={(e) => handleInputChange("processor", e.target.value)}
                  className="border-gray-300 text-base"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi singkat tentang produk"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="border-gray-300 text-base"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="ramOptions" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Opsi RAM (pisahkan dengan koma)
                </Label>
                <Input
                  id="ramOptions"
                  type="text"
                  placeholder="Contoh: 8 GB, 16 GB, 32 GB"
                  value={formData.ramOptions}
                  onChange={(e) => handleInputChange("ramOptions", e.target.value)}
                  className="border-gray-300 text-base"
                />
              </div>

              <div>
                <Label htmlFor="ssdOptions" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Opsi SSD (pisahkan dengan koma)
                </Label>
                <Input
                  id="ssdOptions"
                  type="text"
                  placeholder="Contoh: 256 GB, 512 GB, 1 TB"
                  value={formData.ssdOptions}
                  onChange={(e) => handleInputChange("ssdOptions", e.target.value)}
                  className="border-gray-300 text-base"
                />
              </div>

              <div>
                <Label htmlFor="variants" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Varian dan Harga
                </Label>
                <Textarea
                  id="variants"
                  placeholder="Format: RAM, SSD, Harga (per baris)
Contoh:
8 GB, 256 GB, 3900000
8 GB, 512 GB, 4200000
16 GB, 512 GB, 4800000"
                  value={formData.variants}
                  onChange={(e) => handleInputChange("variants", e.target.value)}
                  className="border-gray-300 font-mono text-sm"
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="specs" className="text-gray-700 mb-2 block text-sm sm:text-base">
                  Spesifikasi Detail (satu per baris)
                </Label>
                <Textarea
                  id="specs"
                  placeholder="Masukkan spesifikasi detail, satu per baris
Contoh:
RAM : 8GB > SSD : 128GB 3.8jt
RAM : 8GB > SSD : 256GB 3.9jt"
                  value={formData.specs}
                  onChange={(e) => handleInputChange("specs", e.target.value)}
                  className="border-gray-300 text-base"
                  rows={5}
                />
              </div>
            </div>

            {/* Submit Button - Responsive */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-base sm:text-lg font-medium"
              >
                Tambah Produk
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
