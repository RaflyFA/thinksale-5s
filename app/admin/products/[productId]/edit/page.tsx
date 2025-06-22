"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, X, Loader2 } from "lucide-react";
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
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCategories } from "@/lib/hooks/use-categories";
import { Switch } from "@/components/ui/switch";

// Re-using the same validation interface
interface ValidationErrors {
  name?: string;
  processor?: string;
  ramOptions?: string;
  ssdOptions?: string;
  variants?: string;
  specs?: string;
  category?: string;
  discountPercentage?: string;
  discountDates?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [productName, setProductName] = useState("");
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
    discount_percentage: 0,
    discount_start_date: "",
    discount_end_date: "",
    is_discount_active: false,
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

  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    try {
      setInitialLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data produk.");
      }
      const product = await response.json();
      
      // Format discount dates for date input fields
      const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };
      
      setProductName(product.name);
      setFormData({
        name: product.name,
        category_id: product.category_id,
        processor: product.processor,
        description: product.description || "",
        ramOptions: product.ram_options.join(", "),
        ssdOptions: product.ssd_options.join(", "),
        variants: product.variants.map((v: any) => `${v.ram}, ${v.ssd}, ${v.price}`).join("\n"),
        specs: product.specs?.join("\n") || "",
        imageUrl: product.image,
        discount_percentage: product.discount_percentage || 0,
        discount_start_date: formatDateForInput(product.discount_start_date),
        discount_end_date: formatDateForInput(product.discount_end_date),
        is_discount_active: product.is_discount_active || false,
      });
      setPreviewUrl(product.image);

    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data produk.");
      router.push('/admin/products');
    } finally {
      setInitialLoading(false);
    }
  }, [productId, router]);
  
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama Produk wajib diisi";
    if (!formData.category_id) newErrors.category = "Kategori wajib dipilih";
    if (!formData.processor.trim()) newErrors.processor = "Processor wajib diisi";
    if (!formData.ramOptions.trim()) newErrors.ramOptions = "Opsi RAM wajib diisi";
    if (!formData.ssdOptions.trim()) newErrors.ssdOptions = "Opsi SSD wajib diisi";
    if (!formData.variants.trim()) newErrors.variants = "Varian dan Harga wajib diisi";
    
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
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Set to start of day
        
        if (endDate <= startDate) {
          newErrors.discountDates = "Tanggal berakhir harus setelah tanggal mulai";
        }
        
        if (startDate < today) {
          newErrors.discountDates = "Tanggal mulai tidak boleh di masa lalu";
        }
      }
    }
    
    // Add more specific validations from AddProductPage if needed...
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0 && !!formData.imageUrl;
    setIsFormValid(isValid);
  }, [formData, formData.imageUrl]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setUploadError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, imageUrl: "" })); // Invalidate form until new image is uploaded
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
      const response = await fetch("/api/upload-image", { method: "POST", body: data });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengunggah gambar.");
      }
      const result = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      toast.success("Gambar berhasil diunggah!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(error.message || "Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Harap perbaiki error pada form dan pastikan gambar telah diunggah sebelum menyimpan.");
      return;
    }
    setLoading(true);

    try {
      const variants = formData.variants.split('\n').filter(line => line.trim()).map((v, i) => {
        const parts = v.split(',').map(p => p.trim());
        if (parts.length < 3) throw new Error(`Format varian baris ${i + 1} tidak valid.`);
        const price = parseInt(parts[2].replace(/\\D/g, ''), 10);
        if (isNaN(price)) throw new Error(`Harga pada baris ${i+1} tidak valid.`);
        return { ram: parts[0], ssd: parts[1], price };
      });

      if (variants.length === 0) throw new Error("Minimal harus ada satu varian.");

      const prices = variants.map(v => v.price);
      const priceRange = prices.length > 1 ? `${Math.min(...prices)} - ${Math.max(...prices)}` : `${prices[0]}`;

      const productData = {
        name: formData.name.trim(),
        category_id: formData.category_id,
        processor: formData.processor.trim(),
        description: formData.description.trim() || null,
        image: formData.imageUrl,
        images: [formData.imageUrl],
        ram_options: formData.ramOptions.split(',').map(o => o.trim()).filter(Boolean),
        ssd_options: formData.ssdOptions.split(',').map(o => o.trim()).filter(Boolean),
        price_range: priceRange,
        specs: formData.specs.split('\n').filter(s => s.trim()),
        discount_percentage: formData.discount_percentage,
        discount_start_date: formData.discount_start_date,
        discount_end_date: formData.discount_end_date,
        is_discount_active: formData.is_discount_active,
      };
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        let errorMessage = 'Gagal memperbarui produk.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Strategy: Delete old variants and create new ones
      const deleteResponse = await fetch(`/api/admin/product-variants/by-product/${productId}`, { 
        method: 'DELETE' 
      });
      
      if (!deleteResponse.ok) {
        console.warn('Failed to delete old variants');
      }
      
      for (const variant of variants) {
        const variantResponse = await fetch('/api/admin/product-variants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, ...variant }),
        });

        if (!variantResponse.ok) {
          console.warn('Failed to save variant:', variant);
        }
      }

      toast.success("Produk berhasil diperbarui!");
      router.push('/admin/products');

    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Terjadi kesalahan saat memperbarui produk.");
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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Produk</h2>
          <p className="text-muted-foreground">
            Perbarui detail untuk: <span className="font-semibold text-blue-600">{productName}</span>
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
              Informasi utama produk yang akan diperbarui
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
                <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="absolute -top-2 -right-2"><X className="h-4 w-4" /></Button>
              </div>
            )}
            {imageFile && !formData.imageUrl && (
              <div className="space-y-2">
                <Button type="button" onClick={handleImageUpload} disabled={loading} className="w-full">
                  {loading ? "Mengunggah..." : "Unggah Gambar untuk Simpan"}
                </Button>
                {uploadError && <p className="text-destructive text-sm">{uploadError}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi</CardTitle>
            <CardDescription>Konfigurasi RAM, SSD, dan spesifikasi detail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="ramOptions">Opsi RAM *</Label>
                <Input id="ramOptions" value={formData.ramOptions} onChange={(e) => handleInputChange("ramOptions", e.target.value)} placeholder="Contoh: 4GB, 8GB, 16GB" className={errors.ramOptions ? "border-red-500" : ""} required />
                {errors.ramOptions ? (
                  <p className="text-sm text-red-500">{errors.ramOptions}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Pisahkan dengan koma</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssdOptions">Opsi SSD *</Label>
                <Input id="ssdOptions" value={formData.ssdOptions} onChange={(e) => handleInputChange("ssdOptions", e.target.value)} placeholder="Contoh: 128GB, 256GB, 512GB" className={errors.ssdOptions ? "border-red-500" : ""} required />
                {errors.ssdOptions ? (
                  <p className="text-sm text-red-500">{errors.ssdOptions}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Pisahkan dengan koma</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specs">Spesifikasi Detail</Label>
              <Textarea id="specs" value={formData.specs} onChange={(e) => handleInputChange("specs", e.target.value)} placeholder="Satu spesifikasi per baris..." rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Variants and Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Varian dan Harga</CardTitle>
            <CardDescription>Konfigurasi varian produk dan harga masing-masing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="variants">Varian dan Harga *</Label>
              <Textarea id="variants" value={formData.variants} onChange={(e) => handleInputChange("variants", e.target.value)} placeholder="Format: RAM, SSD, Harga&#10;Contoh:&#10;4GB, 128GB, 8500000&#10;8GB, 256GB, 9500000" rows={6} className={errors.variants ? "border-red-500" : ""} required />
              {errors.variants ? (
                <p className="text-sm text-red-500">{errors.variants}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Format: RAM, SSD, Harga (satu varian per baris)</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Discount Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Diskon</CardTitle>
            <CardDescription>
              Atur diskon untuk produk ini (opsional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="discount-active">Aktifkan Diskon</Label>
                <p className="text-sm text-muted-foreground">
                  Aktifkan diskon untuk produk ini
                </p>
              </div>
              <Switch
                id="discount-active"
                checked={formData.is_discount_active}
                onCheckedChange={(checked) => handleInputChange("is_discount_active", checked)}
              />
            </div>

            {formData.is_discount_active && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="discount-percentage">Persentase Diskon (%)</Label>
                  <Input
                    id="discount-percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => handleInputChange("discount_percentage", parseInt(e.target.value) || 0)}
                    placeholder="Contoh: 15"
                    className={errors.discountPercentage ? "border-red-500" : ""}
                  />
                  {errors.discountPercentage && (
                    <p className="text-sm text-red-500">{errors.discountPercentage}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-start">Tanggal Mulai Diskon</Label>
                    <Input
                      id="discount-start"
                      type="date"
                      value={formData.discount_start_date}
                      onChange={(e) => handleInputChange("discount_start_date", e.target.value)}
                      className={errors.discountDates ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-end">Tanggal Berakhir Diskon</Label>
                    <Input
                      id="discount-end"
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

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Info:</strong> Diskon akan otomatis aktif pada tanggal mulai dan nonaktif setelah tanggal berakhir.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Batal</Link>
          </Button>
          <Button type="submit" disabled={!isFormValid || loading}>
            <Plus className="mr-2 h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
} 