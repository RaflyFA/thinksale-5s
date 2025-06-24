"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Save,
  X,
  RefreshCw,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import type { ProductVariant, Stock } from "@/lib/types"

interface StockManagementSectionProps {
  productId: string
}

export function StockManagementSection({ productId }: StockManagementSectionProps) {
  const [editingStock, setEditingStock] = useState<number | null>(null)
  const [editQuantity, setEditQuantity] = useState<number>(0)
  const [newStockQuantity, setNewStockQuantity] = useState<number>(0)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const queryClient = useQueryClient()

  // Fetch product variants
  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/product-variants/by-product/${productId}`)
      if (!response.ok) throw new Error("Gagal mengambil data varian")
      const data = await response.json()
      return data.data as ProductVariant[]
    }
  })

  // Fetch stock data
  const { data: stockData, isLoading: isLoadingStock } = useQuery({
    queryKey: ["stock", "product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/stock?product_id=${productId}`)
      if (!response.ok) throw new Error("Gagal mengambil data stok")
      const data = await response.json()
      return data.data as Stock[]
    }
  })

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async (stockData: { product_id: string; variant_id?: string; quantity: number }) => {
      const response = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData)
      })
      if (!response.ok) throw new Error("Gagal memperbarui stok")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock", "product", productId] })
      toast.success("Stok berhasil diperbarui")
      setEditingStock(null)
    },
    onError: (error) => {
      toast.error("Gagal memperbarui stok")
      console.error("Error update stok:", error)
    }
  })

  // Add new stock mutation
  const addStockMutation = useMutation({
    mutationFn: async (stockData: { product_id: string; variant_id?: string; quantity: number }) => {
      const response = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData)
      })
      if (!response.ok) throw new Error("Gagal menambah stok")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock", "product", productId] })
      toast.success("Stok berhasil ditambahkan")
      setNewStockQuantity(0)
      setSelectedVariant("")
    },
    onError: (error) => {
      toast.error("Gagal menambah stok")
      console.error("Error tambah stok:", error)
    }
  })

  // Delete stock mutation
  const deleteStockMutation = useMutation({
    mutationFn: async (stockId: number) => {
      const response = await fetch(`/api/admin/stock?id=${stockId}`, {
        method: "DELETE"
      })
      if (!response.ok) throw new Error("Gagal menghapus stok")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock", "product", productId] })
      toast.success("Stok berhasil dihapus")
    },
    onError: (error) => {
      toast.error("Gagal menghapus stok")
      console.error("Error hapus stok:", error)
    }
  })

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock.id)
    setEditQuantity(stock.quantity)
  }

  const handleSave = (stock: Stock) => {
    if (editQuantity < 0) {
      toast.error("Jumlah tidak boleh negatif")
      return
    }

    updateStockMutation.mutate({
      product_id: stock.product_id,
      variant_id: stock.variant_id,
      quantity: editQuantity
    })
  }

  const handleCancel = () => {
    setEditingStock(null)
    setEditQuantity(0)
  }

  const handleDelete = (stockId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus record stok ini?")) {
      deleteStockMutation.mutate(stockId)
    }
  }

  const handleAddStock = () => {
    if (!selectedVariant) {
      toast.error("Silakan pilih varian")
      return
    }
    if (newStockQuantity < 0) {
      toast.error("Jumlah tidak boleh negatif")
      return
    }

    addStockMutation.mutate({
      product_id: productId,
      variant_id: selectedVariant,
      quantity: newStockQuantity
    })
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Habis", color: "destructive" }
    if (quantity <= 5) return { label: "Stok Terbatas", color: "destructive" }
    if (quantity <= 10) return { label: "Stok Sedang", color: "secondary" }
    return { label: "Tersedia", color: "default" }
  }

  const getVariantStock = (variantId: string) => {
    return stockData?.find(stock => stock.variant_id === variantId)
  }

  if (isLoadingVariants || isLoadingStock) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Memuat data stok...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Stock */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Tambah Stok Baru</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Pilih Varian</label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Pilih varian...</option>
                {variants?.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.ram} | {variant.ssd} | Rp {variant.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="text-sm font-medium mb-2 block">Jumlah</label>
              <Input
                type="number"
                min="0"
                value={newStockQuantity}
                onChange={(e) => setNewStockQuantity(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <Button
              onClick={handleAddStock}
              disabled={addStockMutation.isPending || !selectedVariant}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Stok
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Stock */}
      <div className="space-y-4">
        <h3 className="font-semibold">Stok Saat Ini</h3>
        
        {variants?.map((variant) => {
          const stock = getVariantStock(variant.id)
          const status = stock ? getStockStatus(stock.quantity) : { label: "Tidak Ada Stok", color: "secondary" }
          const isEditing = editingStock === stock?.id

          return (
            <Card key={variant.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {variant.ram} | {variant.ssd}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Rp {variant.price.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={status.color as any}>
                        {status.label}
                      </Badge>
                      {stock && (
                        <span className="text-sm text-gray-500">
                          Terakhir diperbarui: {new Date(stock.updated_at || stock.created_at || "").toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Jumlah</p>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                          className="w-20"
                          min="0"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-blue-600">
                          {stock?.quantity || 0}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {stock ? (
                        isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSave(stock)}
                              disabled={updateStockMutation.isPending}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(stock)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(stock.id)}
                              disabled={deleteStockMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVariant(variant.id)
                            setNewStockQuantity(0)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Tambah Stok
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Ringkasan Stok</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Varian:</span>
            <span className="ml-2 font-medium">{variants?.length || 0}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Stok:</span>
            <span className="ml-2 font-medium">
              {stockData?.reduce((sum, stock) => sum + stock.quantity, 0) || 0}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Stok Terbatas:</span>
            <span className="ml-2 font-medium">
              {stockData?.filter(stock => stock.quantity <= 5).length || 0}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Stok Habis:</span>
            <span className="ml-2 font-medium">
              {stockData?.filter(stock => stock.quantity === 0).length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 