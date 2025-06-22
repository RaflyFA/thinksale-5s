"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Store,
  Mail,
  Shield,
  Database,
  Bell,
  Save,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "@/components/ui/image-upload"

interface SettingsData {
  general: {
    store_name: string
    store_description: string
    contact_email: string
    contact_phone: string
    store_logo: string
    hero_image: string
  }
  notification: {
    email_notifications: boolean
    order_notifications: boolean
    user_notifications: boolean
    system_notifications: boolean
  }
  system: {
    app_version: string
    database_type: string
    framework: string
    authentication: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      store_name: "",
      store_description: "",
      contact_email: "",
      contact_phone: "",
      store_logo: "",
      hero_image: ""
    },
    notification: {
      email_notifications: true,
      order_notifications: true,
      user_notifications: false,
      system_notifications: true
    },
    system: {
      app_version: "",
      database_type: "",
      framework: "",
      authentication: ""
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        } else {
          toast.error("Gagal memuat pengaturan")
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error("Gagal memuat pengaturan")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleGeneralSettingsChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }))
  }

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification: {
        ...prev.notification,
        [field]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Prepare settings for API
      const settingsToUpdate = {
        ...settings.general,
        ...settings.notification
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsToUpdate }),
      })

      if (response.ok) {
        toast.success("Pengaturan berhasil disimpan!")
        // Refresh settings to update the cache
        refreshSettings()
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menyimpan pengaturan")
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error("Gagal menyimpan pengaturan")
    } finally {
      setSaving(false)
    }
  }

  const refreshSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error refreshing settings:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
          <p className="text-muted-foreground">
            Kelola pengaturan sistem dan preferensi
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Pengaturan Umum
            </CardTitle>
            <CardDescription>
              Konfigurasi dasar toko dan informasi kontak
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store_name">Nama Toko</Label>
                <Input
                  id="store_name"
                  value={settings.general.store_name}
                  onChange={(e) => handleGeneralSettingsChange("store_name", e.target.value)}
                  placeholder="Masukkan nama toko"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Kontak</Label>
                <Input
                  id="contact_email"
                  value={settings.general.contact_email}
                  onChange={(e) => handleGeneralSettingsChange("contact_email", e.target.value)}
                  placeholder="admin@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Nomor Telepon</Label>
                <Input
                  id="contact_phone"
                  value={settings.general.contact_phone}
                  onChange={(e) => handleGeneralSettingsChange("contact_phone", e.target.value)}
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_description">Deskripsi Toko</Label>
                <Input
                  id="store_description"
                  value={settings.general.store_description}
                  onChange={(e) => handleGeneralSettingsChange("store_description", e.target.value)}
                  placeholder="Deskripsi singkat tentang toko"
                />
              </div>
            </div>
            
            {/* Image Uploads - Side by Side */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <ImageUpload
                  value={settings.general.store_logo}
                  onChange={(value) => handleGeneralSettingsChange("store_logo", value)}
                  label="Logo Toko"
                  placeholder="Upload logo toko..."
                />
              </div>

              {/* Hero Banner Upload */}
              <div>
                <ImageUpload
                  value={settings.general.hero_image}
                  onChange={(value) => handleGeneralSettingsChange("hero_image", value)}
                  label="Gambar Banner Halaman Utama (Hero)"
                  placeholder="Upload gambar banner..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengaturan Notifikasi
            </CardTitle>
            <CardDescription>
              Kelola preferensi notifikasi sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email_notifications">Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi melalui email
                  </p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={settings.notification.email_notifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("email_notifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order_notifications">Notifikasi Pesanan</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi saat ada pesanan baru
                  </p>
                </div>
                <Switch
                  id="order_notifications"
                  checked={settings.notification.order_notifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("order_notifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="user_notifications">Notifikasi Pengguna</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi saat ada user baru mendaftar
                  </p>
                </div>
                <Switch
                  id="user_notifications"
                  checked={settings.notification.user_notifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("user_notifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system_notifications">Notifikasi Sistem</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi untuk update sistem dan maintenance
                  </p>
                </div>
                <Switch
                  id="system_notifications"
                  checked={settings.notification.system_notifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("system_notifications", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Informasi Sistem
            </CardTitle>
            <CardDescription>
              Informasi teknis tentang sistem yang sedang berjalan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Versi Aplikasi</Label>
                <p className="text-sm text-muted-foreground">{settings.system.app_version}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Database</Label>
                <p className="text-sm text-muted-foreground">{settings.system.database_type}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Framework</Label>
                <p className="text-sm text-muted-foreground">{settings.system.framework}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Authentication</Label>
                <p className="text-sm text-muted-foreground">{settings.system.authentication}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 