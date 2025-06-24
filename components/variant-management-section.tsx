"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { toast } from "sonner"

export interface ProductVariant {
  id?: string
  ram: string
  ssd: string
  price: number
  stock: number
}

interface VariantManagementSectionProps {
  variants: ProductVariant[]
  onVariantsChange: (variants: ProductVariant[]) => void
}

export function VariantManagementSection({ variants, onVariantsChange }: VariantManagementSectionProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<ProductVariant, 'id'>>({
    ram: '',
    ssd: '',
    price: 0,
    stock: 0
  })

  const resetForm = () => setForm({ ram: '', ssd: '', price: 0, stock: 0 })

  const handleChange = (field: keyof typeof form, value: any) => setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    if (!form.ram.trim() || !form.ssd.trim() || form.price <= 0 || form.stock < 0) {
      toast.error("RAM, SSD, harga (>0), dan stok (>=0) wajib diisi")
      return false
    }
    return true
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!validate()) return
    if (variants.some(v => v.ram === form.ram && v.ssd === form.ssd)) {
      toast.error("Varian RAM+SSD sudah ada")
      return
    }
    onVariantsChange([...variants, { ...form }])
    resetForm()
  }

  const handleEdit = (idx: number) => {
    const v = variants[idx]
    setForm({
      ram: v.ram,
      ssd: v.ssd,
      price: v.price,
      stock: v.stock
    })
    setEditingIdx(idx)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!validate() || editingIdx === null) return
    const updated = [...variants]
    updated[editingIdx] = { ...updated[editingIdx], ...form }
    onVariantsChange(updated)
    setEditingIdx(null)
    resetForm()
  }

  const handleDelete = (idx: number) => {
    if (confirm("Hapus varian ini?")) onVariantsChange(variants.filter((_, i) => i !== idx))
  }

  const handleCancel = () => { setEditingIdx(null); resetForm() }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah/Edit Varian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            <div><Label>RAM</Label><Input value={form.ram} onChange={e => handleChange('ram', e.target.value)} /></div>
            <div><Label>SSD</Label><Input value={form.ssd} onChange={e => handleChange('ssd', e.target.value)} /></div>
            <div><Label>Harga</Label><Input type="number" value={form.price} onChange={e => handleChange('price', parseInt(e.target.value)||0)} /></div>
            <div><Label>Stok</Label><Input type="number" value={form.stock} onChange={e => handleChange('stock', parseInt(e.target.value)||0)} /></div>
          </div>
          <div className="flex gap-2 mt-2">
            {editingIdx === null ? (
              <Button type="button" onClick={handleAdd}><Plus className="h-4 w-4 mr-1" />Tambah</Button>
            ) : (
              <>
                <Button type="button" onClick={handleSave}><Save className="h-4 w-4 mr-1" />Simpan</Button>
                <Button type="button" variant="outline" onClick={handleCancel}><X className="h-4 w-4 mr-1" />Batal</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Daftar Varian</CardTitle></CardHeader>
        <CardContent>
          {variants.length === 0 ? <div className="text-gray-500">Belum ada varian</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-2">RAM</th>
                    <th className="border px-2">SSD</th>
                    <th className="border px-2">Harga</th>
                    <th className="border px-2">Stok</th>
                    <th className="border px-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="border px-2">{v.ram}</td>
                      <td className="border px-2">{v.ssd}</td>
                      <td className="border px-2">Rp {v.price.toLocaleString('id-ID')}</td>
                      <td className="border px-2">{v.stock}</td>
                      <td className="border px-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(i)}><Edit className="h-4 w-4" /></Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleDelete(i)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 