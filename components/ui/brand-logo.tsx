/**
 * Brand Logo Component
 *
 * Komponen logo yang konsisten untuk seluruh aplikasi
 * Menggunakan data dari settings dan fallback ke logo default
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import Image from "next/image"
import { useSettings } from "@/lib/providers/settings-provider"
import { cn } from "@/lib/utils/cn"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  textClassName?: string
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8", 
  lg: "w-10 h-10",
  xl: "w-12 h-12"
}

const textSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl", 
  xl: "text-2xl"
}

export default function BrandLogo({ 
  size = "md", 
  showText = true, 
  className,
  textClassName 
}: BrandLogoProps) {
  const { settings } = useSettings()

  // Use settings data or fallback to defaults
  const storeName = settings?.general?.store_name || "ThinkSale"
  const storeLogo = settings?.general?.store_logo

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo */}
      {storeLogo ? (
        <div className={cn("relative", sizeClasses[size])}>
          <Image
            src={storeLogo}
            alt={storeName}
            width={size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 40 : 48}
            height={size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 40 : 48}
            className="rounded-lg object-cover"
          />
        </div>
      ) : (
        <div className={cn("bg-blue-600 rounded-lg flex items-center justify-center", sizeClasses[size])}>
          <span className="text-white font-bold text-xl">T</span>
        </div>
      )}

      {/* Store Name */}
      {showText && (
        <span className={cn("font-bold text-gray-800", textSizes[size], textClassName)}>
          {storeName}
        </span>
      )}
    </div>
  )
} 