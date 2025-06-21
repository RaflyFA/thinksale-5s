"use client"

import { useState } from "react"
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
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "ThinkSale",
    storeDescription: "Toko laptop terpercaya dengan kualitas terbaik",
    contactEmail: "admin@thinksale.com",
    contactPhone: "+62 812-3456-7890"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: false,
    systemNotifications: true
  })

  const handleGeneralSettingsChange = (field: string, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = () => {
    // TODO: Implement save to Supabase
    console.log("Saving settings:", { generalSettings, notificationSettings })
    toast.success("Pengaturan berhasil disimpan!")
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
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
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
                <Label htmlFor="storeName">Nama Toko</Label>
                <Input
                  id="storeName"
                  value={generalSettings.storeName}
                  onChange={(e) => handleGeneralSettingsChange("storeName", e.target.value)}
                  placeholder="Masukkan nama toko"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Kontak</Label>
                <Input
                  id="contactEmail"
                  value={generalSettings.contactEmail}
                  onChange={(e) => handleGeneralSettingsChange("contactEmail", e.target.value)}
                  placeholder="admin@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Nomor Telepon</Label>
                <Input
                  id="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={(e) => handleGeneralSettingsChange("contactPhone", e.target.value)}
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Deskripsi Toko</Label>
                <Input
                  id="storeDescription"
                  value={generalSettings.storeDescription}
                  onChange={(e) => handleGeneralSettingsChange("storeDescription", e.target.value)}
                  placeholder="Deskripsi singkat tentang toko"
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
                  <Label htmlFor="emailNotifications">Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi melalui email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("emailNotifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orderNotifications">Notifikasi Pesanan</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi saat ada pesanan baru
                  </p>
                </div>
                <Switch
                  id="orderNotifications"
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("orderNotifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="userNotifications">Notifikasi Pengguna</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi saat ada user baru mendaftar
                  </p>
                </div>
                <Switch
                  id="userNotifications"
                  checked={notificationSettings.userNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("userNotifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemNotifications">Notifikasi Sistem</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi untuk update sistem dan maintenance
                  </p>
                </div>
                <Switch
                  id="systemNotifications"
                  checked={notificationSettings.systemNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("systemNotifications", checked)}
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
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Database</Label>
                <p className="text-sm text-muted-foreground">Supabase</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Framework</Label>
                <p className="text-sm text-muted-foreground">Next.js 14</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Authentication</Label>
                <p className="text-sm text-muted-foreground">NextAuth.js</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 