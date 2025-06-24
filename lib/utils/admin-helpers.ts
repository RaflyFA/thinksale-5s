import type { 
  DashboardStats, 
  ProductWithStock, 
  StockWithProduct, 
  ValidationErrors,
  TableState 
} from '@/lib/types/admin'

// Currency formatting
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Stock status helpers
export const getStockStatus = (quantity: number) => {
  if (quantity === 0) {
    return {
      status: 'out_of_stock',
      label: 'Habis',
      color: 'destructive',
      available: false
    }
  }
  if (quantity <= 5) {
    return {
      status: 'low_stock',
      label: 'Stok Terbatas',
      color: 'secondary',
      available: true
    }
  }
  return {
    status: 'in_stock',
    label: 'Tersedia',
    color: 'default',
    available: true
  }
}

export const getStockAlertLevel = (quantity: number): 'critical' | 'low' | 'warning' => {
  if (quantity === 0) return 'critical'
  if (quantity <= 5) return 'low'
  if (quantity <= 10) return 'warning'
  return 'low' // Default for any other case
}

// Order status helpers
export const getOrderStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'processing':
      return 'outline'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

export const getOrderStatusLabel = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Menunggu'
    case 'confirmed':
      return 'Dikonfirmasi'
    case 'processing':
      return 'Diproses'
    case 'shipped':
      return 'Dikirim'
    case 'delivered':
      return 'Terkirim'
    case 'cancelled':
      return 'Dibatalkan'
    default:
      return status || 'Unknown'
  }
}

// Payment status helpers
export const getPaymentStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'failed':
      return 'destructive'
    default:
      return 'outline'
  }
}

// Product validation
export const validateProductForm = (data: any): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.name?.trim()) {
    errors.name = 'Nama Produk wajib diisi'
  }

  if (!data.category_id) {
    errors.category = 'Kategori wajib dipilih'
  }

  if (!data.processor?.trim()) {
    errors.processor = 'Processor wajib diisi'
  }

  if (!data.ramOptions?.length) {
    errors.ramOptions = 'Opsi RAM wajib diisi'
  }

  if (!data.ssdOptions?.length) {
    errors.ssdOptions = 'Opsi SSD wajib diisi'
  }

  if (!data.variants?.length) {
    errors.variants = 'Minimal harus ada satu varian'
  }

  if (!data.imageUrl) {
    errors.image = 'Gambar produk wajib diunggah'
  }

  // Validate discount
  if (data.is_discount_active) {
    if (data.discount_percentage <= 0 || data.discount_percentage > 100) {
      errors.discountPercentage = 'Persentase diskon harus antara 1-100%'
    }

    if (!data.discount_start_date || !data.discount_end_date) {
      errors.discountDates = 'Tanggal mulai dan berakhir diskon wajib diisi'
    } else {
      const startDate = new Date(data.discount_start_date)
      const endDate = new Date(data.discount_end_date)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (endDate <= startDate) {
        errors.discountDates = 'Tanggal berakhir harus setelah tanggal mulai'
      }

      if (startDate < today) {
        errors.discountDates = 'Tanggal mulai tidak boleh di masa lalu'
      }
    }
  }

  return errors
}

// Stock validation
export const validateStockForm = (data: any): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.product_id) {
    errors.product_id = 'Produk wajib dipilih'
  }

  if (data.quantity < 0) {
    errors.quantity = 'Quantity tidak boleh negatif'
  }

  return errors
}

// Table state management
export const createInitialTableState = (): TableState => ({
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  filters: {}
})

export const updateTableState = (
  currentState: TableState,
  updates: Partial<TableState>
): TableState => ({
  ...currentState,
  ...updates
})

// Search and filter helpers
export const filterProducts = (
  products: ProductWithStock[],
  search: string,
  filters: Record<string, any>
): ProductWithStock[] => {
  let filtered = products

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.processor.toLowerCase().includes(searchLower) ||
      product.category?.name.toLowerCase().includes(searchLower)
    )
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter(product => product.category_id === filters.category)
  }

  // Stock filter
  if (filters.stockStatus) {
    filtered = filtered.filter(product => {
      const totalStock = product.total_stock || 0
      switch (filters.stockStatus) {
        case 'in_stock':
          return totalStock > 10
        case 'low_stock':
          return totalStock > 0 && totalStock <= 10
        case 'out_of_stock':
          return totalStock === 0
        default:
          return true
      }
    })
  }

  // Featured filter
  if (filters.featured !== undefined) {
    filtered = filtered.filter(product => product.is_featured === filters.featured)
  }

  return filtered
}

export const sortProducts = (
  products: ProductWithStock[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): ProductWithStock[] => {
  return [...products].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'category':
        aValue = a.category?.name || ''
        bValue = b.category?.name || ''
        break
      case 'stock':
        aValue = a.total_stock || 0
        bValue = b.total_stock || 0
        break
      case 'created_at':
        aValue = new Date(a.created_at || '').getTime()
        bValue = new Date(b.created_at || '').getTime()
        break
      default:
        aValue = a[sortBy as keyof ProductWithStock]
        bValue = b[sortBy as keyof ProductWithStock]
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

// Pagination helpers
export const paginateData = <T>(
  data: T[],
  page: number,
  limit: number
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    }
  }
}

// File upload helpers
export const validateImageFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    return 'Ukuran file terlalu besar. Maksimal 5MB.'
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP.'
  }

  return null
}

// Data transformation helpers
export const transformProductForForm = (product: ProductWithStock) => {
  return {
    name: product.name,
    category_id: product.category?.id || '',
    processor: product.processor,
    description: product.description || '',
    imageUrl: product.image || '',
    ramOptions: product.ram_options || [],
    ssdOptions: product.ssd_options || [],
    variants: product.variants?.map(v => ({
      ram: v.ram,
      ssd: v.ssd,
      price: v.price
    })) || [],
    specs: product.specs || [],
    discount_percentage: product.discount_percentage || 0,
    discount_start_date: product.discount_start_date ? 
      new Date(product.discount_start_date).toISOString().split('T')[0] : '',
    discount_end_date: product.discount_end_date ? 
      new Date(product.discount_end_date).toISOString().split('T')[0] : '',
    is_discount_active: product.is_discount_active || false,
    is_featured: product.is_featured || false,
    is_best_seller: product.is_best_seller || false
  }
}

// Error handling helpers
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.error) {
    return error.response.data.error
  }
  if (error?.message) {
    return error.message
  }
  return 'Terjadi kesalahan yang tidak diketahui'
}

// Performance helpers
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
} 