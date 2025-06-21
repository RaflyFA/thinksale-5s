import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "@/lib/auth/session-provider"
import { CartProvider } from "@/lib/cart/cart-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ThinkSale - Laptop Terpercaya",
  description: "Toko laptop terpercaya dengan koleksi lengkap ThinkPad dan Dell",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  )
}
