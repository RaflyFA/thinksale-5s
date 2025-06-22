// app/admin/add-product/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { useCategories } from "@/lib/hooks/use-categories";

interface ValidationErrors {
  name?: string;
  processor?: string;
  ramOptions?: string;
  ssdOptions?: string;
  variants?: string;
  specs?: string;
}

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch categories from database
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !formData.category_id) {
      setFormData(prev => ({ ...prev, category_id: categories[0].id }))
    }
  }, [categories, formData.category_id])

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Nama Produk wajib diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama Produk minimal 3 karakter";
    }

    // Validate category
    if (!formData.category_id) {
      newErrors.category = "Kategori wajib dipilih";
    }

    // Validate processor
    if (!formData.processor.trim()) {
      newErrors.processor = "Processor wajib diisi";
    } else if (formData.processor.trim().length < 5) {
      newErrors.processor = "Processor minimal 5 karakter";
    }

    // Validate RAM options
    if (!formData.ramOptions.trim()) {
      newErrors.ramOptions = "Opsi RAM wajib diisi";
    } else {
      const ramOptions = formData.ramOptions
        .split(",")
        .map(ram => ram.trim())
        .filter(ram => ram);
      
      if (ramOptions.length === 0) {
        newErrors.ramOptions = "Minimal satu opsi RAM harus diisi";
      } else if (ramOptions.some(ram => ram.length < 2)) {
        newErrors.ramOptions = "Format RAM tidak valid (contoh: 8GB, 16GB)";
      }
    }

    // Validate SSD options
    if (!formData.ssdOptions.trim()) {
      newErrors.ssdOptions = "Opsi SSD wajib diisi";
    } else {
      const ssdOptions = formData.ssdOptions
        .split(",")
        .map(ssd => ssd.trim())
        .filter(ssd => ssd);
      
      if (ssdOptions.length === 0) {
        newErrors.ssdOptions = "Minimal satu opsi SSD harus diisi";
      } else if (ssdOptions.some(ssd => ssd.length < 3)) {
        newErrors.ssdOptions = "Format SSD tidak valid (contoh: 256GB, 512GB)";
      }
    }

    // Validate variants
    if (!formData.variants.trim()) {
      newErrors.variants = "Varian dan Harga wajib diisi";
    } else {
      const variants = formData.variants
        .split("\n")
        .filter(line => line.trim());
      
      if (variants.length === 0) {
        newErrors.variants = "Minimal satu varian harus diisi";
      } else {
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];
          const parts = variant.split(",").map(v => v.trim());
          
          if (parts.length < 3) {
            newErrors.variants = `Format varian baris ${i + 1} tidak valid. Gunakan format: RAM, SSD, Harga`;
            break;
          }
          
          const [ram, ssd, price] = parts;
          if (!ram || !ssd || !price) {
            newErrors.variants = `Data varian baris ${i + 1} tidak lengkap`;
            break;
          }
          
          const parsedPrice = parseInt(price.replace(/\D/g, ""), 10);
          if (isNaN(parsedPrice) || parsedPrice <= 0) {
            newErrors.variants = `Format harga di varian baris ${i + 1} tidak valid`;
            break;
          }
        }
      }
    }

    // Validate specs (optional but if filled, should be valid)
    if (formData.specs.trim()) {
      const specs = formData.specs
        .split("\n")
        .filter(line => line.trim());
      
      if (specs.some(spec => spec.trim().length < 2)) {
        newErrors.specs = "Spesifikasi tidak boleh kosong";
      }
    }

    setErrors(newErrors);
    
    // Check if form is valid
    const isValid = Object.keys(newErrors).length === 0 && formData.imageUrl;
    setIsFormValid(isValid);
  }, [formData, formData.imageUrl]);

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
      data.append("file", imageFile);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengunggah gambar.");
      }

      const result = await response.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.imageUrl) {
      toast.error("Harap unggah gambar produk terlebih dahulu.");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Nama Produk wajib diisi.");
      return;
    }
    if (!formData.category_id) {
      toast.error("Kategori wajib dipilih.");
      return;
    }
    if (!formData.processor.trim()) {
      toast.error("Processor wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      // Parse variants with better validation
      if (!formData.variants.trim()) {
        throw new Error("Varian dan Harga wajib diisi.");
      }

      const variants = formData.variants
        .split("\n")
        .filter(line => line.trim())
        .map((variant, index) => {
          const parts = variant.split(",").map((v) => v.trim());
          if (parts.length < 3) {
            throw new Error(`Format varian baris ${index + 1} tidak valid. Gunakan format: RAM, SSD, Harga`);
          }
          
          const [ram, ssd, price] = parts;
          if (!ram || !ssd || !price) {
            throw new Error(`Data varian baris ${index + 1} tidak lengkap. Pastikan RAM, SSD, dan Harga terisi.`);
          }
          
          const parsedPrice = parseInt(price.replace(/\D/g, ""), 10);
          if (isNaN(parsedPrice) || parsedPrice <= 0) {
            throw new Error(`Format harga di varian baris ${index + 1} tidak valid. Harap masukkan angka yang valid.`);
          }
          
          return { ram, ssd, price: parsedPrice };
        });

      if (variants.length === 0) {
        throw new Error("Minimal satu varian harus diisi.");
      }

      // Parse specs with validation
      const specs = formData.specs
        .split("\n")
        .filter(line => line.trim())
        .map(spec => spec.trim());

      // Parse RAM and SSD options with validation
    if (!formData.ramOptions.trim()) {
        throw new Error("Opsi RAM wajib diisi.");
      }
      
      const ramOptions = formData.ramOptions
        .split(",")
        .map(ram => ram.trim())
        .filter(ram => ram);

      if (ramOptions.length === 0) {
        throw new Error("Minimal satu opsi RAM harus diisi.");
    }

    if (!formData.ssdOptions.trim()) {
        throw new Error("Opsi SSD wajib diisi.");
      }
      
      const ssdOptions = formData.ssdOptions
    .split(",")
        .map(ssd => ssd.trim())
        .filter(ssd => ssd);

      if (ssdOptions.length === 0) {
        throw new Error("Minimal satu opsi SSD harus diisi.");
      }

      // Calculate price range
      const prices = variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = minPrice === maxPrice ? `${minPrice}` : `${minPrice} - ${maxPrice}`;

      // Prepare product data for Supabase
      const productData = {
        name: formData.name.trim(),
        category_id: formData.category_id,
        processor: formData.processor.trim(),
        description: formData.description.trim() || null,
        image: formData.imageUrl,
        images: [formData.imageUrl],
        ram_options: ramOptions,
        ssd_options: ssdOptions,
        price_range: priceRange,
        specs: specs,
        rating: null,
        review_count: 0
      };

      // Save to Supabase
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan produk');
      }

      const savedProduct = await response.json();

      // Save variants
      for (const variant of variants) {
        const variantResponse = await fetch('/api/admin/product-variants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: savedProduct.id,
            ram: variant.ram,
            ssd: variant.ssd,
            price: variant.price
          }),
        });

        if (!variantResponse.ok) {
          console.warn('Failed to save variant:', variant);
        }
      }

      toast.success("Produk berhasil ditambahkan!");
      
      // Reset form
    setFormData({
      name: "",
        category_id: "",
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

      // Redirect to products list
      window.location.href = '/admin/products';

    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setLoading(false);
    }
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
        {/* Form Status */}
        {Object.keys(errors).length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">
                  Ada {Object.keys(errors).length} field yang perlu diperbaiki
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {isFormValid && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">
                  Form sudah valid dan siap disimpan
                </span>
                  </div>
            </CardContent>
          </Card>
        )}

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
                  className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange("category_id", e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  disabled={categoriesLoading}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="processor">Processor *</Label>
              <Input
                id="processor"
                value={formData.processor}
                onChange={(e) => handleInputChange("processor", e.target.value)}
                placeholder="Contoh: Intel Core i5-7300U"
                className={errors.processor ? "border-red-500 focus:border-red-500" : ""}
                required
              />
              {errors.processor && (
                <p className="text-sm text-red-500">{errors.processor}</p>
              )}
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
                  className={errors.ramOptions ? "border-red-500 focus:border-red-500" : ""}
                  required
                />
                {errors.ramOptions ? (
                  <p className="text-sm text-red-500">{errors.ramOptions}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Pisahkan dengan koma
                  </p>
                )}
            </div>
              <div className="space-y-2">
                <Label htmlFor="ssdOptions">Opsi SSD *</Label>
              <Input
                id="ssdOptions"
                value={formData.ssdOptions}
                  onChange={(e) => handleInputChange("ssdOptions", e.target.value)}
                  placeholder="Contoh: 128GB, 256GB, 512GB"
                  className={errors.ssdOptions ? "border-red-500 focus:border-red-500" : ""}
                  required
                />
                {errors.ssdOptions ? (
                  <p className="text-sm text-red-500">{errors.ssdOptions}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Pisahkan dengan koma
                  </p>
                )}
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
                className={errors.specs ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.specs ? (
                <p className="text-sm text-red-500">{errors.specs}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Satu spesifikasi per baris
                </p>
              )}
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
                className={errors.variants ? "border-red-500 focus:border-red-500" : ""}
                required
              />
              {errors.variants ? (
                <p className="text-sm text-red-500">{errors.variants}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Format: RAM, SSD, Harga (satu varian per baris)
                </p>
              )}
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
          <Button type="submit" disabled={!isFormValid || loading}>
            <Plus className="mr-2 h-4 w-4" />
            {loading ? "Menyimpan..." : "Tambah Produk"}
              </Button>
            </div>
          </form>
    </div>
  );
}
