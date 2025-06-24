import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { getProductStockStatus, getVariantStockStatus, formatStockQuantity } from "@/lib/utils/stock-helpers"
import type { Product, ProductVariant } from "@/lib/types"

interface StockDisplayProps {
  product?: Product
  variant?: ProductVariant
  showQuantity?: boolean
  className?: string
}

export function StockDisplay({ product, variant, showQuantity = true, className }: StockDisplayProps) {
  if (!product && !variant) {
    return null
  }

  const stockInfo = variant 
    ? getVariantStockStatus(variant)
    : getProductStockStatus(product!)

  const getIcon = () => {
    switch (stockInfo.status) {
      case 'out_of_stock':
        return <Package className="h-3 w-3" />
      case 'low_stock':
        return <AlertTriangle className="h-3 w-3" />
      case 'in_stock':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Package className="h-3 w-3" />
    }
  }

  const getLabel = () => {
    if (showQuantity && stockInfo.quantity > 0) {
      return formatStockQuantity(stockInfo.quantity)
    }
    return stockInfo.label
  }

  return (
    <Badge
      variant={stockInfo.color as any}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        className
      )}
    >
      {getIcon()}
      {getLabel()}
    </Badge>
  )
}

interface StockStatusProps {
  quantity: number
  className?: string
}

export function StockStatus({ quantity, className }: StockStatusProps) {
  const getStatus = () => {
    if (quantity === 0) {
      return {
        label: 'Habis',
        color: 'destructive',
        icon: Package
      }
    }
    if (quantity <= 5) {
      return {
        label: 'Stok Terbatas',
        color: 'secondary',
        icon: AlertTriangle
      }
    }
    return {
      label: 'Tersedia',
      color: 'default',
      icon: CheckCircle
    }
  }

  const status = getStatus()
  const Icon = status.icon

  return (
    <Badge
      variant={status.color as any}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {formatStockQuantity(quantity)}
    </Badge>
  )
} 