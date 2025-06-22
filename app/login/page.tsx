"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth/use-auth"
import { Chrome } from "lucide-react"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useSettings } from "@/lib/providers/settings-provider"
import BrandLogo from "@/components/ui/brand-logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { settings } = useSettings()

  // Use settings data or fallback to defaults
  const storeName = settings?.general?.store_name || "ThinkSale"

  const redirectTo = searchParams.get("redirect") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah")
      } else {
        router.push(redirectTo)
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo size="xl" showText={true} />
          </div>
          <p className="mt-2 text-sm text-gray-600">Masuk ke akun Anda</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Masuk ke Akun</CardTitle>
            <CardDescription>Pilih metode login yang Anda inginkan</CardDescription>
          </CardHeader>
          <CardContent>
              {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Loader2 className="h-5 w-5" />
                <span>{isLoading ? "Memproses..." : "Masuk"}</span>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Dengan melanjutkan, Anda menyetujui{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Kebijakan Privasi
                </Link>{" "}
                kami.
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Kembali ke beranda
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
