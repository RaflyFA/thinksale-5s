"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Gambar",
  placeholder = "Pilih file gambar...",
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("File harus berupa gambar")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB")
      return
    }

    setUploading(true)
    
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading logo...')

      // Upload using our API route
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload error response:', errorData)
        throw new Error(errorData.error || `Upload failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('Upload success response:', data)

      const imageUrl = data.url

      if (!imageUrl) {
        throw new Error('No image URL received from server')
      }

      setPreview(imageUrl)
      onChange(imageUrl)
      toast.success("Logo berhasil diupload!")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Gagal mengupload logo. Silakan coba lagi.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      <div className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg border-2 border-gray-200 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Mengupload..." : "Upload Gambar"}
          </Button>
          
          {preview && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemoveImage}
              disabled={uploading}
            >
              Hapus
            </Button>
          )}
        </div>

        {/* Hidden File Input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
} 