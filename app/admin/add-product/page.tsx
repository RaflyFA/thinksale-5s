// app/admin/add-product/page.tsx
"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image"; // Pastikan Image diimpor untuk preview gambar

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
    imageUrl: "", // Simpan URL gambar yang sudah diupload
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // State untuk file gambar yang dipilih
  const [loading, setLoading] = useState(false); // State untuk indikator loading upload
  const [uploadError, setUploadError] = useState<string | null>(null); // State untuk menampilkan error upload

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUploadError(null); // Reset error saat file baru dipilih
      // Opsional: Langsung upload setelah pilih gambar (tanpa tombol "Unggah Gambar")
      // handleImageUpload(e.target.files[0]);
    }
  };

  // Fungsi untuk mengunggah gambar ke API Route (untuk pengembangan lokal)
  // Untuk produksi online, logika di sini perlu diubah untuk upload ke Cloud Storage
  const handleImageUpload = async () => {
    if (!imageFile) {
      setUploadError("Pilih file gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    setUploadError(null); // Bersihkan error sebelumnya

    try {
      const data = new FormData();
      data.append("image", imageFile);

      // Panggil API Route untuk mengunggah gambar
      const response = await fetch("/api/upload-image", {
        // Pastikan Anda memiliki api/upload-image/route.ts
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengunggah gambar.");
      }

      const result = await response.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.imageUrl, // Simpan URL gambar yang dikembalikan oleh API
      }));
      alert("Gambar berhasil diunggah! URL: " + result.imageUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(
        error.message ||
          "Terjadi kesalahan saat mengunggah gambar. Pastikan folder public/uploads ada."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validasi Form Tambahan ---
    if (!formData.imageUrl) {
      alert("Harap unggah gambar produk terlebih dahulu.");
      return;
    }
    if (!formData.name.trim()) {
      alert("Nama Produk wajib diisi.");
      return;
    }
    if (!formData.processor.trim()) {
      alert("Processor wajib diisi.");
      return;
    }
    if (!formData.ramOptions.trim()) {
      alert("Opsi RAM wajib diisi.");
      return;
    }
    if (!formData.ssdOptions.trim()) {
      alert("Opsi SSD wajib diisi.");
      return;
    }
    if (!formData.variants.trim()) {
      alert("Varian dan Harga wajib diisi.");
      return;
    }
    // --- Akhir Validasi Form ---

    // Contoh format data yang dihasilkan untuk dimasukkan ke lib/data.ts
    // Catatan: Pastikan format gambar di sini tidak ada ?height=...&width=...
    const formattedData = `{
  id: "${Math.random().toString(36).substr(2, 9)}",
  name: "${formData.name}",
  category: "${formData.category}",
  processor: "${formData.processor}",
  description: "${formData.description}",
  image: "${formData.imageUrl}", // Menggunakan URL gambar yang sudah diupload
  images: [
    "${
      formData.imageUrl
    }", // Anda bisa tambahkan input multiple images di sini jika perlu
  ],
  ramOptions: [${formData.ramOptions
    .split(",")
    .map((ram) => `"${ram.trim()}"`)
    .join(", ")}],
  ssdOptions: [${formData.ssdOptions
    .split(",")
    .map((ssd) => `"${ssd.trim()}"`)
    .join(", ")}],
  priceRange: "${
    formData.variants.split("\n")[0]?.split(",")[2]?.trim() || "0"
  } - ${formData.variants.split("\n").pop()?.split(",")[2]?.trim() || "0"}",
  specs: [
    ${formData.specs
      .split("\n")
      .map((spec) => `"${spec.trim()}"`)
      .join(",\n     ")}
  ],
  variants: [
    ${formData.variants
      .split("\n")
      .map((variant) => {
        const [ram, ssd, price] = variant.split(",").map((v) => v.trim());
        // Validasi harga adalah angka sebelum parse
        const parsedPrice = parseInt(price.replace(/\D/g, ""), 10);
        if (isNaN(parsedPrice)) {
          alert("Format harga di Varian tidak valid. Harap masukkan angka.");
          throw new Error("Invalid price format"); // Hentikan proses jika harga tidak valid
        }
        return `{ ram: "${ram}", ssd: "${ssd}", price: ${parsedPrice} }`;
      })
      .join(",\n     ")}
  ]
}`;

    console.log("Formatted data for lib/data.ts:", formattedData);
    alert(
      "Produk berhasil ditambahkan! Lihat console untuk data yang dihasilkan. Jangan lupa tempelkan data ini ke lib/data.ts"
    );
    // Reset form setelah submit berhasil
    setFormData({
      name: "",
      category: "",
      processor: "",
      description: "",
      ramOptions: "",
      ssdOptions: "",
      variants: "",
      specs: "",
      imageUrl: "",
    });
    setImageFile(null); // Reset file yang dipilih
  };

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 py-2">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-md font-semibold">Tambah Produk</h1>
          </div>
        </div>
      </header>

      {/* Main content - Form Tambah Produk */}
      <main className="w-full px-4 py-6">
        {" "}
        {/* Main section akan full width dengan padding horizontal */}
        <div className="max-w-4xl mx-auto">
          {" "}
          {/* Mengubah ini dari max-w-[42rem] dan menambahkan mx-auto untuk menengahkan form di layar lebar */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
          >
            {/* Product Image */}
            <div>
              <Label className="text-gray-700 mb-2 block">Gambar Produk</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center">
                {formData.imageUrl ? (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview Produk"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                )}
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="imageUpload">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Pilih Gambar
                  </Button>
                </Label>
                {imageFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    File dipilih: {imageFile.name}
                  </p>
                )}
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || loading}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  {loading ? "Mengunggah..." : "Unggah Gambar"}
                </Button>
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Format: JPG, PNG, WebP. Maks 2MB
                </p>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-gray-700 mb-2 block">
                Nama Produk
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Contoh: Lenovo ThinkPad T470s"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-gray-700 mb-2 block">
                Kategori
              </Label>
              <Input
                id="category"
                type="text"
                placeholder="Contoh: thinkpad, dell"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Processor */}
            <div>
              <Label htmlFor="processor" className="text-gray-700 mb-2 block">
                Processor
              </Label>
              <Input
                id="processor"
                type="text"
                placeholder="Contoh: Intel Core i5 Gen 7"
                value={formData.processor}
                onChange={(e) => handleInputChange("processor", e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-gray-700 mb-2 block">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat tentang produk"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border-gray-300"
                rows={3}
              />
            </div>

            {/* RAM Options */}
            <div>
              <Label htmlFor="ramOptions" className="text-gray-700 mb-2 block">
                Opsi RAM (pisahkan dengan koma)
              </Label>
              <Input
                id="ramOptions"
                type="text"
                placeholder="Contoh: 8 GB, 16 GB, 32 GB"
                value={formData.ramOptions}
                onChange={(e) =>
                  handleInputChange("ramOptions", e.target.value)
                }
                className="border-gray-300"
              />
            </div>

            {/* SSD Options */}
            <div>
              <Label htmlFor="ssdOptions" className="text-gray-700 mb-2 block">
                Opsi SSD (pisahkan dengan koma)
              </Label>
              <Input
                id="ssdOptions"
                type="text"
                placeholder="Contoh: 256 GB, 512 GB, 1 TB"
                value={formData.ssdOptions}
                onChange={(e) =>
                  handleInputChange("ssdOptions", e.target.value)
                }
                className="border-gray-300"
              />
            </div>

            {/* Variants and Prices */}
            <div>
              <Label htmlFor="variants" className="text-gray-700 mb-2 block">
                Varian dan Harga
              </Label>
              <Textarea
                id="variants"
                placeholder={`Format: RAM, SSD, Harga (per baris)\nContoh:\n8 GB, 256 GB, 3900000\n8 GB, 512 GB, 4200000\n16 GB, 512 GB, 4800000`}
                value={formData.variants}
                onChange={(e) => handleInputChange("variants", e.target.value)}
                className="border-gray-300 font-mono text-sm"
                rows={5}
              />
            </div>

            {/* Specifications */}
            <div>
              <Label htmlFor="specs" className="text-gray-700 mb-2 block">
                Spesifikasi Detail (satu per baris)
              </Label>
              <Textarea
                id="specs"
                placeholder={`Masukkan spesifikasi detail, satu per baris\nContoh:\nRAM : 8GB > SSD : 128GB\nLayar : 14 inch Full HD`}
                value={formData.specs}
                onChange={(e) => handleInputChange("specs", e.target.value)}
                className="border-gray-300"
                rows={5}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg py-3 text-lg font-medium"
              >
                Tambah Produk
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
