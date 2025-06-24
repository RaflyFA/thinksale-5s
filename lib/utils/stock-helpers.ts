import type { Product, ProductVariant } from '@/lib/types'

/**
 * Get stock status for a product
 */
export function getProductStockStatus(product: Product) {
  // Check if product has total_stock information
  if (product.total_stock !== undefined) {
    if (product.total_stock === 0) {
      return {
        status: 'out_of_stock',
        label: 'Habis',
        color: 'destructive',
        available: false,
        quantity: 0
      }
    }
    if (product.total_stock <= 5) {
      return {
        status: 'low_stock',
        label: 'Stok Terbatas',
        color: 'secondary',
        available: true,
        quantity: product.total_stock
      }
    }
    return {
      status: 'in_stock',
      label: 'Tersedia',
      color: 'default',
      available: true,
      quantity: product.total_stock
    }
  }

  // Fallback to variant stock check
  if (product.variants && product.variants.length > 0) {
    const totalStock = product.variants.reduce((sum, variant) => {
      const stock = (variant as any).stock_quantity || 0
      return sum + stock
    }, 0)

    if (totalStock === 0) {
      return {
        status: 'out_of_stock',
        label: 'Habis',
        color: 'destructive',
        available: false,
        quantity: 0
      }
    }
    if (totalStock <= 5) {
      return {
        status: 'low_stock',
        label: 'Stok Terbatas',
        color: 'secondary',
        available: true,
        quantity: totalStock
      }
    }
    return {
      status: 'in_stock',
      label: 'Tersedia',
      color: 'default',
      available: true,
      quantity: totalStock
    }
  }

  // Default fallback
  return {
    status: 'unknown',
    label: 'Tersedia',
    color: 'default',
    available: true,
    quantity: 0
  }
}

/**
 * Get stock status for a specific variant
 */
export function getVariantStockStatus(variant: ProductVariant) {
  const stock = (variant as any).stock_quantity || 0
  
  if (stock === 0) {
    return {
      status: 'out_of_stock',
      label: 'Habis',
      color: 'destructive',
      available: false,
      quantity: 0
    }
  }
  if (stock <= 5) {
    return {
      status: 'low_stock',
      label: 'Stok Terbatas',
      color: 'secondary',
      available: true,
      quantity: stock
    }
  }
  return {
    status: 'in_stock',
    label: 'Tersedia',
    color: 'default',
    available: true,
    quantity: stock
  }
}

/**
 * Check if product has any available stock
 */
export function hasAvailableStock(product: Product): boolean {
  const stockStatus = getProductStockStatus(product)
  return stockStatus.available
}

/**
 * Check if variant has available stock
 */
export function hasVariantStock(variant: ProductVariant): boolean {
  const stockStatus = getVariantStockStatus(variant)
  return stockStatus.available
}

/**
 * Get available variants with stock
 */
export function getAvailableVariants(product: Product): ProductVariant[] {
  if (!product.variants) return []
  
  return product.variants.filter(variant => hasVariantStock(variant))
}

/**
 * Get stock quantity for a specific variant
 */
export function getVariantStockQuantity(variant: ProductVariant): number {
  return (variant as any).stock_quantity || 0
}

/**
 * Get total stock quantity for a product
 */
export function getProductTotalStock(product: Product): number {
  if (product.total_stock !== undefined) {
    return product.total_stock
  }

  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((sum, variant) => {
      return sum + getVariantStockQuantity(variant)
    }, 0)
  }

  return 0
}

/**
 * Format stock quantity for display
 */
export function formatStockQuantity(quantity: number): string {
  if (quantity === 0) return 'Habis'
  if (quantity <= 5) return `${quantity} tersisa`
  return `${quantity} tersedia`
}

/**
 * Get stock warning level
 */
export function getStockWarningLevel(quantity: number): 'none' | 'low' | 'critical' {
  if (quantity === 0) return 'critical'
  if (quantity <= 5) return 'low'
  return 'none'
} 