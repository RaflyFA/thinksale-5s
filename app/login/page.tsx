"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth/use-auth"
import { Chrome } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      await login("google")
    } catch (error) {
      setError("Gagal login dengan Google. Silakan coba lagi.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">ThinkSale</span>
          </Link>
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
                onClick={handleGoogleLogin}
                disabled={isLoading || authLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Chrome className="h-5 w-5" />
                <span>{isLoading || authLoading ? "Memproses..." : "Masuk dengan Google"}</span>
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
