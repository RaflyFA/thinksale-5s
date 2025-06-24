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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  category_id: string
  processor: string
  description: string | null
  image: string | null
  images: string[] | null
  ram_options: string[] | null
  ssd_options: string[] | null
  price_range: string | null
  specs: string[] | null
  rating: number | null
  review_count: number | null
  is_featured: boolean
  is_best_seller: boolean
  discount_percentage: number | null
  discount_start_date: string | null
  discount_end_date: string | null
  is_discount_active: boolean
  created_at: string
  updated_at: string
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
    stock_quantity?: number
    stock_status?: string
  }>
  total_stock?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [openVariantModal, setOpenVariantModal] = useState(false)
  const [selectedProductVariants, setSelectedProductVariants] = useState<Product["variants"]>([])
  const [selectedProductName, setSelectedProductName] = useState<string>("")

  const router = useRouter()

  // Fetch categories from database
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, stockFilter, sortBy, sortOrder])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('query', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (stockFilter !== 'all') params.append('stock', stockFilter)
      if (sortBy) params.append('sortBy', sortBy)
      if (sortOrder) params.append('sortOrder', sortOrder)
      
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

  const getMinPrice = (variants?: Product["variants"]) => {
    if (!variants || variants.length === 0) return null;
    const prices = variants.map(v => v.price ?? 0).filter(p => p > 0);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  };

  const getMaxPrice = (variants?: Product["variants"]) => {
    if (!variants || variants.length === 0) return null;
    const prices = variants.map(v => v.price ?? 0).filter(p => p > 0);
    if (prices.length === 0) return null;
    return Math.max(...prices);
  };

  const getDisplayPrice = (product: Product) => {
    const minPrice = getMinPrice(product.variants);
    const maxPrice = getMaxPrice(product.variants);
    if (minPrice == null) return "N/A";
    if (maxPrice == null) return formatPrice(minPrice);
    if (minPrice === maxPrice) return formatPrice(minPrice);
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const getDiscountedPrice = (product: Product) => {
    if (!product.is_discount_active || !product.discount_percentage) return null;
    const minPrice = getMinPrice(product.variants);
    if (minPrice == null) return null;
    const discounted = minPrice - (minPrice * (product.discount_percentage / 100));
    return formatPrice(discounted);
  };

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Produk</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produk Unggulan</p>
                <p className="text-2xl font-bold">{products.filter(p => p.is_featured).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stok Tersedia</p>
                <p className="text-2xl font-bold text-green-600">{
                  products.filter(p =>
                    p.variants && p.variants.some(v => (v.stock_quantity ?? 0) > 0)
                  ).length
                }</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✔</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stok Kosong</p>
                <p className="text-2xl font-bold text-red-600">{
                  products.filter(p =>
                    !p.variants || p.variants.every(v => (v.stock_quantity ?? 0) === 0)
                  ).length
                }</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✖</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-64">
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
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="all">Semua Stok</option>
          <option value="in_stock">Tersedia</option>
          <option value="out_of_stock">Habis</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="created_at">Dibuat</option>
          <option value="name">Nama</option>
          <option value="price_range">Harga</option>
          <option value="total_stock">Stock</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="h-10 px-3"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
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
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Varian</TableHead>
                    <TableHead>Dibuat</TableHead>
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
                            {product.description && (
                              <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.category?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-32 truncate" title={product.processor}>
                        {product.processor}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {product.variants && product.variants.length > 0 ? (
                            (() => {
                              const prices = product.variants
                                .map(v => v.price ?? 0)
                                .filter(p => p > 0)
                              if (prices.length === 0) return <span className="italic text-muted-foreground">N/A</span>
                              const minPrice = Math.min(...prices)
                              const maxPrice = Math.max(...prices)
                              if (minPrice === maxPrice) {
                                return <span className="font-medium">{formatPrice(minPrice)}</span>
                              }
                              return (
                                <>
                                  <span className="font-medium">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>
                                  <span className="ml-1 text-xs text-muted-foreground">(Harga bervariasi)</span>
                            </>
                              )
                            })()
                          ) : (
                            <span className="italic text-muted-foreground">N/A</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{product.total_stock || 0} total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
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
                          {product.is_discount_active && product.discount_percentage && (
                            <Badge variant="destructive" className="text-xs">
                              -{product.discount_percentage}%
                            </Badge>
                          )}
                          {product.total_stock === 0 && (
                            <Badge variant="outline" className="text-xs text-red-600">
                              Habis
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <div className="font-medium">{product.variants?.length || 0} varian</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1"
                            onClick={() => {
                              setSelectedProductVariants(product.variants || [])
                              setSelectedProductName(product.name)
                              setOpenVariantModal(true)
                            }}
                          >
                            Lihat Varian
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <div>{new Date(product.created_at).toLocaleDateString('id-ID')}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(product.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
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
                              <Link href={`/admin/products/${product.id}`} legacyBehavior passHref>
                                <a className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                                </a>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}/edit`} legacyBehavior passHref>
                                <a className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                                </a>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFeatured(product.id, product.is_featured)}>
                              <Star className="mr-2 h-4 w-4" />
                              {product.is_featured ? 'Hapus dari Unggulan' : 'Tambah ke Unggulan'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleBestSeller(product.id, product.is_best_seller)}>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              {product.is_best_seller ? 'Hapus dari Terlaris' : 'Tambah ke Terlaris'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
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

      <Dialog open={openVariantModal} onOpenChange={setOpenVariantModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Varian untuk {selectedProductName}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RAM</TableHead>
                  <TableHead>SSD</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProductVariants && selectedProductVariants.length > 0 ? (
                  selectedProductVariants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.ram}</TableCell>
                      <TableCell>{variant.ssd}</TableCell>
                      <TableCell>{variant.price ? formatPrice(variant.price) : '-'}</TableCell>
                      <TableCell>{variant.stock_quantity ?? 0}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Tidak ada varian</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 