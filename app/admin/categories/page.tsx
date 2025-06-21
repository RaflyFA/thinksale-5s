"use client"

import { useState } from "react"
import Image from "next/image"
import { PlusCircle, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { CategoryForm } from "@/components/admin/category-form"
import { Category } from "@/lib/types"
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ErrorState from "@/components/ui/error-state"

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Fetch categories from database
  const { 
    data: categories = [], 
    isLoading, 
    error,
    refetch 
  } = useCategories()

  const deleteCategoryMutation = useDeleteCategory()
  
  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedCategory(null)
    setIsFormOpen(true)
  }
  
  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId)
      toast.success("Kategori berhasil dihapus!")
    } catch (error) {
      toast.error("Gagal menghapus kategori. Silakan coba lagi.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState 
        title="Gagal Memuat Kategori"
        message="Terjadi kesalahan saat memuat data kategori. Silakan coba lagi."
        onRetry={refetch}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
            <p className="text-muted-foreground">
              Kelola kategori produk untuk toko Anda.
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
            <CardDescription>
              Total {categories.length} kategori ditemukan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Belum ada kategori. Mulai dengan menambahkan kategori pertama.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      Gambar
                    </TableHead>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt={category.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={category.image}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {category.slug}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(category.id)}
                              disabled={deleteCategoryMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deleteCategoryMutation.isPending ? "Menghapus..." : "Hapus"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {categories.length > 0 && (
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Menampilkan <strong>1-{categories.length}</strong> dari <strong>{categories.length}</strong> kategori.
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      <CategoryForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
      />
    </>
  )
}