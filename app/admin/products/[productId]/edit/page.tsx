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

// Re-using the same validation interface
interface ValidationErrors {
  name?: string;
  processor?: string;
  ramOptions?: string;
  ssdOptions?: string;
  variants?: string;
  specs?: string;
  category?: string;
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
      };
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal memperbarui produk.');
      }
      
      // Strategy: Delete old variants and create new ones
      await fetch(`/api/admin/product-variants/by-product/${productId}`, { method: 'DELETE' });
      
      for (const variant of variants) {
        await fetch('/api/admin/product-variants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, ...variant }),
        });
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
            Perbarui detail untuk: <span className="font-semibold">{productName}</span>
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
        {/* Form content copied from AddProductPage */}
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

        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi</CardTitle>
            <CardDescription>Konfigurasi RAM, SSD, dan spesifikasi detail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="ramOptions">Opsi RAM *</Label>
                <Input id="ramOptions" value={formData.ramOptions} onChange={(e) => handleInputChange("ramOptions", e.target.value)} placeholder="Contoh: 4GB, 8GB" className={errors.ramOptions ? "border-red-500" : ""} required />
                {errors.ramOptions ? <p className="text-sm text-red-500">{errors.ramOptions}</p> : <p className="text-sm text-muted-foreground">Pisahkan dengan koma</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssdOptions">Opsi SSD *</Label>
                <Input id="ssdOptions" value={formData.ssdOptions} onChange={(e) => handleInputChange("ssdOptions", e.target.value)} placeholder="Contoh: 128GB, 256GB" className={errors.ssdOptions ? "border-red-500" : ""} required />
                {errors.ssdOptions ? <p className="text-sm text-red-500">{errors.ssdOptions}</p> : <p className="text-sm text-muted-foreground">Pisahkan dengan koma</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specs">Spesifikasi Detail</Label>
              <Textarea id="specs" value={formData.specs} onChange={(e) => handleInputChange("specs", e.target.value)} placeholder="Satu spesifikasi per baris..." rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Varian dan Harga</CardTitle>
            <CardDescription>Konfigurasi varian produk dan harga masing-masing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="variants">Varian dan Harga *</Label>
              <Textarea id="variants" value={formData.variants} onChange={(e) => handleInputChange("variants", e.target.value)} placeholder={"Format: RAM, SSD, Harga\\nContoh:\\n4GB, 128GB, 8500000"} rows={6} className={errors.variants ? "border-red-500" : ""} required />
              {errors.variants ? <p className="text-sm text-red-500">{errors.variants}</p> : <p className="text-sm text-muted-foreground">Format: RAM, SSD, Harga (satu varian per baris)</p>}
            </div>
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