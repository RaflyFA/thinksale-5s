import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "@/lib/auth/session-provider"
import { CartProvider } from "@/lib/cart/cart-context"
import QueryProvider from "@/lib/providers/query-provider"
import { SettingsProvider } from "@/lib/providers/settings-provider"
import { getSettings } from "@/lib/settings"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings()
    const storeName = settings.general?.store_name || "ThinkSale"
    const storeDescription = settings.general?.store_description || "Toko laptop terpercaya"

    return {
      title: {
        default: storeName,
        template: `%s | ${storeName}`,
      },
      description: storeDescription,
      generator: 'v0.dev'
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error)
    return {
      title: "ThinkSale",
      description: "Toko laptop terpercaya dengan koleksi lengkap ThinkPad dan Dell",
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <QueryProvider>
          <SettingsProvider>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </SettingsProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
