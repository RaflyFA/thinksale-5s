// app/admin/add-product/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
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
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCategories } from "@/lib/hooks/use-categories";
import { Switch } from "@/components/ui/switch";
import { VariantManagementSection, ProductVariant } from "@/components/variant-management-section";

interface ValidationErrors {
  name?: string;
  processor?: string;
  variants?: string;
  specs?: string;
  category?: string;
  discountPercentage?: string;
  discountDates?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    processor: "",
    description: "",
    specs: "",
    imageUrl: "",
    discount_percentage: 0,
    discount_start_date: "",
    discount_end_date: "",
    is_discount_active: false,
    is_featured: false,
    is_best_seller: false,
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
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

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama Produk wajib diisi";
    if (!formData.category_id) newErrors.category = "Kategori wajib dipilih";
    if (!formData.processor.trim()) newErrors.processor = "Processor wajib diisi";
    
    // Validate variants
    if (variants.length === 0) {
      newErrors.variants = "Minimal satu varian harus diisi";
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

    // Validate discount
    if (formData.is_discount_active) {
      if (formData.discount_percentage <= 0 || formData.discount_percentage > 100) {
        newErrors.discountPercentage = "Persentase diskon harus antara 1-100%";
      }
      
      if (!formData.discount_start_date || !formData.discount_end_date) {
        newErrors.discountDates = "Tanggal mulai dan berakhir diskon wajib diisi";
      } else {
        const startDate = new Date(formData.discount_start_date);
        const endDate = new Date(formData.discount_end_date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (endDate <= startDate) {
          newErrors.discountDates = "Tanggal berakhir harus setelah tanggal mulai";
        }
        
        if (startDate < today) {
          newErrors.discountDates = "Tanggal mulai tidak boleh di masa lalu";
        }
      }
    }

    setErrors(newErrors);
    
    // Check if form is valid
    const isValid = Object.keys(newErrors).length === 0 && !!formData.imageUrl;
    setIsFormValid(isValid);
  }, [formData, formData.imageUrl, variants]);

  useEffect(() => {
    async function fetchProductData() {
      if (!productId) return;
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (!response.ok) throw new Error("Gagal mengambil data produk.");
        const product = await response.json();

        setFormData({
          name: product.name || "",
          category_id: product.category_id || "",
          processor: product.processor || "",
          description: product.description || "",
          specs: (product.specs || []).join("\n"),
          imageUrl: product.image || "",
          discount_percentage: product.discount_percentage || 0,
          discount_start_date: product.discount_start_date || "",
          discount_end_date: product.discount_end_date || "",
          is_discount_active: product.is_discount_active || false,
          is_featured: product.is_featured || false,
          is_best_seller: product.is_best_seller || false,
        });
        console.log("Fetched variants from API:", product.variants);
        setVariants(product.variants || []);
        setPreviewUrl(product.image || "");
      } catch (error) {
        toast.error("Gagal memuat data produk.");
        router.push('/admin/products');
      }
    }
    fetchProductData();
  }, [productId]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setUploadError('File harus berupa gambar.');
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }
      // Validasi ukuran file (maks 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Ukuran gambar maksimal 2MB.');
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }
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
    // Validasi varian
    const validVariants = variants.filter(v => v.ram && v.ssd && typeof v.price === 'number' && v.price > 0 && typeof v.stock === 'number' && v.stock >= 0);
    if (validVariants.length === 0) {
      toast.error('Minimal satu varian valid harus diisi. (RAM, SSD, harga > 0, stok >= 0)');
      return;
    }

    setLoading(true);

    try {
      const specs = formData.specs
        .split("\n")
        .map(spec => spec.trim())
        .filter(spec => spec);

      // Generate RAM and SSD options from variants
      const ramOptions = [...new Set(validVariants.map(v => v.ram))];
      const ssdOptions = [...new Set(validVariants.map(v => v.ssd))];

      // Calculate price range
      const prices = validVariants.map(v => v.price).filter(p => typeof p === 'number' && p > 0);
      let priceRange = '';
      if (prices.length === 0) {
        priceRange = 'N/A';
      } else {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        priceRange = minPrice === maxPrice
          ? `Rp ${minPrice.toLocaleString("id-ID")}`
          : `Rp ${minPrice.toLocaleString("id-ID")} - Rp ${maxPrice.toLocaleString("id-ID")}`;
      }

      console.log("Variants to submit:", validVariants);
      // Prepare product data
      const productData = {
        name: formData.name,
        category_id: formData.category_id,
        processor: formData.processor,
        description: formData.description,
        imageUrl: formData.imageUrl,
        ramOptions,
        ssdOptions,
        price_range: priceRange,
        variants: validVariants.map(v => ({
          id: v.id,
          ram: v.ram,
          ssd: v.ssd,
          price: v.price,
          stock: v.stock,
        })),
        specs,
        discount_percentage: formData.discount_percentage,
        is_discount_active: formData.is_discount_active,
        is_featured: formData.is_featured,
        is_best_seller: formData.is_best_seller,
        ...(formData.discount_start_date ? { discount_start_date: formData.discount_start_date } : {}),
        ...(formData.discount_end_date ? { discount_end_date: formData.discount_end_date } : {}),
      };

      // Create product
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        let errorMessage = 'Gagal memperbarui produk.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      toast.success("Produk berhasil diperbarui!");
      router.push('/admin/products');
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(error.message || "Terjadi kesalahan saat memperbarui produk.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Gagal memuat kategori</p>
          <Button onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tambah Produk Baru</h2>
          <p className="text-muted-foreground">
            Buat produk baru dengan varian dan spesifikasi yang lengkap
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
              Informasi utama produk yang akan dibuat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk *</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Contoh: Lenovo ThinkPad T470" className={errors.name ? "border-red-500" : ""} required />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select 
                  id="category" 
                  value={formData.category_id} 
                  onChange={(e) => handleInputChange("category_id", e.target.value)} 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="processor">Processor *</Label>
              <Input id="processor" value={formData.processor} onChange={(e) => handleInputChange("processor", e.target.value)} placeholder="Contoh: Intel Core i5-7300U" className={errors.processor ? "border-red-500" : ""} required />
              {errors.processor && <p className="text-sm text-red-500">{errors.processor}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Deskripsi produk..." rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Gambar Produk</CardTitle>
            <CardDescription>Unggah gambar utama produk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!previewUrl ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                 <Label htmlFor="image" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <span className="text-primary hover:text-primary/80 font-medium">Pilih gambar</span>
                  <span className="text-muted-foreground"> atau drag and drop</span>
                </Label>
                <input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            ) : (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="absolute -top-2 -right-2">×</Button>
              </div>
            )}
            {imageFile && !formData.imageUrl && (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || loading}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {loading ? 'Mengunggah...' : 'Upload Gambar'}
                </Button>
                {uploadError && (
                  <div className="text-red-500 text-sm mt-2">{uploadError}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Variants Management */}
        <Card>
          <CardHeader>
            <CardTitle>Varian dan Harga</CardTitle>
            <CardDescription>Kelola varian produk dengan interface yang mudah</CardDescription>
          </CardHeader>
          <CardContent>
            <VariantManagementSection
              variants={variants}
              onVariantsChange={setVariants}
            />
            {errors.variants && (
              <p className="text-sm text-red-500 mt-2">{errors.variants}</p>
            )}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi Detail</CardTitle>
            <CardDescription>Spesifikasi tambahan produk (display, port, dll)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specs">Spesifikasi Detail</Label>
              <Textarea id="specs" value={formData.specs} onChange={(e) => handleInputChange("specs", e.target.value)} placeholder="Satu spesifikasi per baris...&#10;Contoh:&#10;Display: 14 inch FHD&#10;Port: USB-C, HDMI&#10;OS: Windows 11" rows={4} />
              <p className="text-sm text-muted-foreground">Spesifikasi seperti display, port, operating system, dll</p>
            </div>
          </CardContent>
        </Card>

        {/* Product Flags */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Produk</CardTitle>
            <CardDescription>Atur flag dan status produk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Produk Unggulan</Label>
                <p className="text-sm text-muted-foreground">
                  Tampilkan di halaman utama sebagai produk unggulan
                </p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Best Seller</Label>
                <p className="text-sm text-muted-foreground">
                  Tandai sebagai produk best seller
                </p>
              </div>
              <Switch
                checked={formData.is_best_seller}
                onCheckedChange={(checked) => handleInputChange("is_best_seller", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discount Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Diskon</CardTitle>
            <CardDescription>
              Atur diskon untuk produk ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aktifkan Diskon</Label>
                <p className="text-sm text-muted-foreground">
                  Aktifkan diskon untuk produk ini
                </p>
              </div>
              <Switch
                checked={formData.is_discount_active}
                onCheckedChange={(checked) => handleInputChange("is_discount_active", checked)}
              />
            </div>

            {formData.is_discount_active && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Persentase Diskon (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => handleInputChange("discount_percentage", parseInt(e.target.value) || 0)}
                    placeholder="10"
                    className={errors.discountPercentage ? "border-red-500" : ""}
                  />
                  {errors.discountPercentage && (
                    <p className="text-sm text-red-500">{errors.discountPercentage}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_start_date">Tanggal Mulai Diskon</Label>
                    <Input
                      id="discount_start_date"
                      type="date"
                      value={formData.discount_start_date}
                      onChange={(e) => handleInputChange("discount_start_date", e.target.value)}
                      className={errors.discountDates ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_end_date">Tanggal Berakhir Diskon</Label>
                    <Input
                      id="discount_end_date"
                      type="date"
                      value={formData.discount_end_date}
                      onChange={(e) => handleInputChange("discount_end_date", e.target.value)}
                      className={errors.discountDates ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {errors.discountDates && (
                  <p className="text-sm text-red-500">{errors.discountDates}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">
              Batal
            </Link>
          </Button>
          <Button type="submit" disabled={!isFormValid || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
