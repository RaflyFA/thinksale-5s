"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { Category } from "@/lib/types"
import { useCreateCategory, useUpdateCategory } from "@/lib/hooks/use-categories"

const categorySchema = z.object({
  name: z.string().min(3, { message: "Nama kategori minimal 3 karakter." }),
  slug: z.string().min(3, { message: "Slug minimal 3 karakter." }),
  image: z.string().min(1, { message: "Gambar kategori wajib diisi." }),
})

interface CategoryFormProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  category?: Category | null
}

export function CategoryForm({ isOpen, onOpenChange, category }: CategoryFormProps) {
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()

  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      image: category?.image || "",
    },
  })

  // Auto-generate slug from name
  const name = watch("name")
  React.useEffect(() => {
    if (name && !category) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setValue("slug", slug)
    }
  }, [name, category, setValue])

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setUploadError(null)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setValue("image", "") // Clear the image field until upload is complete
    }
  }, [setValue])

  const handleImageUpload = React.useCallback(async () => {
    if (!imageFile) {
      setUploadError("Pilih file gambar terlebih dahulu.")
      return
    }

    setUploadLoading(true)
    setUploadError(null)

    try {
      const data = new FormData()
      data.append("file", imageFile)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal mengunggah gambar.")
      }

      const result = await response.json()
      setValue("image", result.url)
      toast.success("Gambar berhasil diunggah!")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setUploadError(
        error.message ||
          "Terjadi kesalahan saat mengunggah gambar."
      )
    } finally {
      setUploadLoading(false)
    }
  }, [imageFile, setValue])

  const removeImage = React.useCallback(() => {
    setImageFile(null)
    setPreviewUrl(null)
    setValue("image", "")
    setUploadError(null)
  }, [setValue])

  const onSubmit = React.useCallback(async (data: z.infer<typeof categorySchema>) => {
    try {
      if (category) {
        // Update existing category
        await updateCategoryMutation.mutateAsync({ id: category.id, data })
        toast.success(`Kategori "${data.name}" berhasil diperbarui!`)
      } else {
        // Create new category
        await createCategoryMutation.mutateAsync(data)
        toast.success(`Kategori "${data.name}" berhasil dibuat!`)
      }
      onOpenChange(false)
    } catch (error) {
      toast.error("Gagal menyimpan kategori. Silakan coba lagi.")
    }
  }, [category, updateCategoryMutation, createCategoryMutation, onOpenChange])
  
  // Reset form when sheet is closed or category changes
  React.useEffect(() => {
    if (!isOpen) {
      reset({ name: "", slug: "", image: "" })
      setImageFile(null)
      setPreviewUrl(null)
      setUploadError(null)
    } else {
       reset({
        name: category?.name || "",
        slug: category?.slug || "",
        image: category?.image || "",
      })
      setPreviewUrl(category?.image || null)
    }
  }, [isOpen, category, reset])

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>{category ? "Edit Kategori" : "Tambah Kategori Baru"}</SheetTitle>
            <SheetDescription>
              {category
                ? "Lakukan perubahan pada kategori yang sudah ada."
                : "Buat kategori baru untuk produk Anda."}
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="cth: ThinkPad, Dell, Aksesoris"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="cth: thinkpad, dell, aksesoris"
                disabled={isLoading || !category} // Disable if editing (auto-generated)
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
              {!category && (
                <p className="text-xs text-muted-foreground">
                  Slug akan dibuat otomatis dari nama kategori
                </p>
              )}
            </div>
            
            {/* Image Upload */}
            <div className="grid gap-2">
              <Label>Gambar Kategori</Label>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {imageFile && !watch("image") && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadLoading || isLoading}
                    className="w-full"
                  >
                    {uploadLoading ? "Mengunggah..." : "Unggah Gambar"}
                  </Button>
                  {uploadError && (
                    <p className="text-destructive text-sm">{uploadError}</p>
                  )}
                </div>
              )}
              
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
              )}
            </div>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Batal
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading || !watch("image")}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
} 