// app/admin/add-product/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "thinkpad",
    processor: "",
    description: "",
    ramOptions: "",
    ssdOptions: "",
    variants: "",
    specs: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setUploadError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setUploadError("Pilih file gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    setUploadError(null);

    try {
      const data = new FormData();
      data.append("image", imageFile);

      const response = await fetch("/api/upload-image", {
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
        imageUrl: result.imageUrl,
      }));
      toast.success("Gambar berhasil diunggah!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(
        error.message ||
          "Terjadi kesalahan saat mengunggah gambar."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.imageUrl) {
      toast.error("Harap unggah gambar produk terlebih dahulu.");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Nama Produk wajib diisi.");
      return;
    }
    if (!formData.processor.trim()) {
      toast.error("Processor wajib diisi.");
      return;
    }
    if (!formData.ramOptions.trim()) {
      toast.error("Opsi RAM wajib diisi.");
      return;
    }
    if (!formData.ssdOptions.trim()) {
      toast.error("Opsi SSD wajib diisi.");
      return;
    }
    if (!formData.variants.trim()) {
      toast.error("Varian dan Harga wajib diisi.");
      return;
    }

    // Format data for lib/data.ts
    const formattedData = `{
  id: "${Math.random().toString(36).substr(2, 9)}",
  name: "${formData.name}",
  category: "${formData.category}",
  processor: "${formData.processor}",
  description: "${formData.description}",
  image: "${formData.imageUrl}",
  images: [
    "${formData.imageUrl}",
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
        const parsedPrice = parseInt(price.replace(/\D/g, ""), 10);
        if (isNaN(parsedPrice)) {
          toast.error("Format harga di Varian tidak valid. Harap masukkan angka.");
          throw new Error("Invalid price format");
        }
        return `{ ram: "${ram}", ssd: "${ssd}", price: ${parsedPrice} }`;
      })
      .join(",\n     ")}
  ]
}`;

    console.log("Formatted data for lib/data.ts:", formattedData);
    toast.success("Produk berhasil ditambahkan! Lihat console untuk data yang dihasilkan.");
    
    // Reset form
    setFormData({
      name: "",
      category: "thinkpad",
      processor: "",
      description: "",
      ramOptions: "",
      ssdOptions: "",
      variants: "",
      specs: "",
      imageUrl: "",
    });
    setImageFile(null);
    setPreviewUrl(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    setUploadError(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tambah Produk Baru</h2>
          <p className="text-muted-foreground">
            Tambahkan produk baru ke dalam sistem
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Produk
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Informasi utama produk yang akan ditambahkan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: Lenovo ThinkPad T470"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="thinkpad">ThinkPad</option>
                  <option value="dell">Dell</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="processor">Processor *</Label>
              <Input
                id="processor"
                value={formData.processor}
                onChange={(e) => handleInputChange("processor", e.target.value)}
                placeholder="Contoh: Intel Core i5-7300U"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Deskripsi produk..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Gambar Produk</CardTitle>
            <CardDescription>
              Unggah gambar utama produk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!previewUrl ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <Label htmlFor="image" className="cursor-pointer">
                  <span className="text-primary hover:text-primary/80 font-medium">
                    Pilih gambar
                  </span>
                  <span className="text-muted-foreground"> atau drag and drop</span>
                </Label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  PNG, JPG, GIF hingga 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="w-32 h-32 relative rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {imageFile && !formData.imageUrl && (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Mengunggah..." : "Unggah Gambar"}
                </Button>
                {uploadError && (
                  <p className="text-destructive text-sm">{uploadError}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi</CardTitle>
            <CardDescription>
              Konfigurasi RAM, SSD, dan spesifikasi detail produk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ramOptions">Opsi RAM *</Label>
                <Input
                  id="ramOptions"
                  value={formData.ramOptions}
                  onChange={(e) => handleInputChange("ramOptions", e.target.value)}
                  placeholder="Contoh: 4GB, 8GB, 16GB"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Pisahkan dengan koma
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssdOptions">Opsi SSD *</Label>
                <Input
                  id="ssdOptions"
                  value={formData.ssdOptions}
                  onChange={(e) => handleInputChange("ssdOptions", e.target.value)}
                  placeholder="Contoh: 128GB, 256GB, 512GB"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Pisahkan dengan koma
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specs">Spesifikasi Detail</Label>
              <Textarea
                id="specs"
                value={formData.specs}
                onChange={(e) => handleInputChange("specs", e.target.value)}
                placeholder="Masukkan spesifikasi detail, satu per baris..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Satu spesifikasi per baris
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Variants and Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Varian dan Harga</CardTitle>
            <CardDescription>
              Konfigurasi varian produk dan harga masing-masing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="variants">Varian dan Harga *</Label>
              <Textarea
                id="variants"
                value={formData.variants}
                onChange={(e) => handleInputChange("variants", e.target.value)}
                placeholder="Format: RAM, SSD, Harga&#10;Contoh:&#10;4GB, 128GB, 8500000&#10;8GB, 256GB, 9500000&#10;16GB, 512GB, 11500000"
                rows={6}
                required
              />
              <p className="text-sm text-muted-foreground">
                Format: RAM, SSD, Harga (satu varian per baris)
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">
              Batal
            </Link>
          </Button>
          <Button type="submit" disabled={!formData.imageUrl}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
      </form>
    </div>
  );
}
