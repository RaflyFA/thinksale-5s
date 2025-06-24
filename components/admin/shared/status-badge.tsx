import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn"

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase()
    
    switch (statusLower) {
      // Order statuses
      case 'pending':
        return { label: 'Menunggu', variant: 'secondary' as const }
      case 'confirmed':
        return { label: 'Dikonfirmasi', variant: 'outline' as const }
      case 'processing':
        return { label: 'Diproses', variant: 'outline' as const }
      case 'shipped':
        return { label: 'Dikirim', variant: 'default' as const }
      case 'delivered':
        return { label: 'Terkirim', variant: 'default' as const }
      case 'cancelled':
        return { label: 'Dibatalkan', variant: 'destructive' as const }
      
      // Payment statuses
      case 'paid':
        return { label: 'Lunas', variant: 'default' as const }
      case 'failed':
        return { label: 'Gagal', variant: 'destructive' as const }
      
      // Stock statuses
      case 'in_stock':
        return { label: 'Tersedia', variant: 'default' as const }
      case 'low_stock':
        return { label: 'Stok Terbatas', variant: 'secondary' as const }
      case 'out_of_stock':
        return { label: 'Habis', variant: 'destructive' as const }
      
      // User roles
      case 'admin':
        return { label: 'Admin', variant: 'default' as const }
      case 'user':
        return { label: 'User', variant: 'outline' as const }
      
      // Default
      default:
        return { label: status, variant: 'outline' as const }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge
      variant={variant || config.variant}
      className={cn("capitalize", className)}
    >
      {config.label}
    </Badge>
  )
} 