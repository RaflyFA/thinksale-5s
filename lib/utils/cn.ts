/**
 * Class Name Utility
 *
 * Utility untuk menggabungkan class names dengan conditional logic
 * Menggunakan clsx dan tailwind-merge untuk optimasi
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Menggabungkan class names dengan handling conditional dan merge Tailwind
 * @param inputs - Array of class values
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility untuk membuat variant classes
 * @param base - Base classes
 * @param variants - Variant object
 * @param defaultVariants - Default variant values
 */
export function createVariants<T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T,
  defaultVariants?: Partial<{ [K in keyof T]: keyof T[K] }>,
) {
  return (props?: Partial<{ [K in keyof T]: keyof T[K] }>) => {
    const mergedProps = { ...defaultVariants, ...props }

    const variantClasses = Object.entries(mergedProps)
      .map(([key, value]) => {
        const variantGroup = variants[key as keyof T]
        return variantGroup?.[value as string] || ""
      })
      .filter(Boolean)
      .join(" ")

    return cn(base, variantClasses)
  }
}
