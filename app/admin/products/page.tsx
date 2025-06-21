"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import { useCategories } from "@/lib/hooks/use-categories"

interface Product {
  id: string
  name: string
  category_id: string
  processor: string
  description: string | null
  image: string | null
  price_range: string | null
  is_featured: boolean
  is_best_seller: boolean
  rating: number | null
  review_count: number | null
  created_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
  variants?: Array<{
    id: string
    ram: string | null
    ssd: string | null
    price: number | null
  }>
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Fetch categories from database
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('query', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      
      const response = await fetch(`/api/admin/products?${params.toString()}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Invalid response format from server')
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal menghapus produk.')
      }

      toast.success('Produk berhasil dihapus!')
      fetchProducts() // Refresh the list
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error(error.message || 'Terjadi kesalahan saat menghapus produk.')
    }
  }

  const toggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_featured: !currentStatus
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal mengupdate status produk.')
      }

      toast.success(`Produk ${!currentStatus ? 'ditambahkan ke' : 'dihapus dari'} produk unggulan!`)
      fetchProducts() // Refresh the list
    } catch (error: any) {
      console.error('Error toggling featured status:', error)
      toast.error(error.message || 'Terjadi kesalahan saat mengupdate status produk.')
    }
  }

  const toggleBestSeller = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_best_seller: !currentStatus
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal mengupdate status produk.')
      }

      toast.success(`Produk ${!currentStatus ? 'ditambahkan ke' : 'dihapus dari'} produk terlaris!`)
      fetchProducts() // Refresh the list
    } catch (error: any) {
      console.error('Error toggling best seller status:', error)
      toast.error(error.message || 'Terjadi kesalahan saat mengupdate status produk.')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produk</h2>
          <p className="text-muted-foreground">
            Kelola semua produk dalam sistem ({products.length} produk)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          disabled={categoriesLoading}
        >
          <option value="all">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Daftar lengkap semua produk yang tersedia dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading products...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchProducts}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Processor</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Varian</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={product.image || ""} alt={product.name} />
                            <AvatarFallback>
                              <Package className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.category?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{product.processor}</TableCell>
                      <TableCell className="text-sm">{product.price_range || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="mr-1 h-3 w-3" />
                              Unggulan
                            </Badge>
                          )}
                          {product.is_best_seller && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Terlaris
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {product.variants?.length || 0} varian
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => toggleFeatured(product.id, product.is_featured)}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              {product.is_featured ? 'Hapus dari Unggulan' : 'Tambah ke Unggulan'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toggleBestSeller(product.id, product.is_best_seller)}
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              {product.is_best_seller ? 'Hapus dari Terlaris' : 'Tambah ke Terlaris'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada produk ditemukan</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Coba ubah filter pencarian Anda' 
                      : 'Belum ada produk dalam sistem'
                    }
                  </p>
                  <Button asChild>
                    <Link href="/admin/products/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Produk Pertama
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 