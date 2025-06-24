// Admin Dashboard Types
export interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalStock: number
  lowStockItems: number
  recentOrders: RecentOrder[]
  stockAlerts: StockAlert[]
}

export interface RecentOrder {
  id: string
  order_number: string
  total_amount: number
  status: string
  customer_name: string
  customer_email?: string
  created_at: string
  payment_status: string
}

export interface StockAlert {
  id: number
  product_id: string
  variant_id?: string
  quantity: number
  product_name: string
  variant_info?: string
  alert_level: 'critical' | 'low' | 'warning'
}

// Product Management Types
export interface ProductFormData {
  name: string
  category_id: string
  processor: string
  description: string
  imageUrl: string
  variants: ProductVariantForm[]
  specs: string[]
  discount_percentage: number
  discount_start_date: string
  discount_end_date: string
  is_discount_active: boolean
  is_featured: boolean
  is_best_seller: boolean
}

export interface ProductVariantForm {
  ram: string
  ssd: string
  price: number
  stock: number
}

export interface ProductWithStock {
  id: string
  name: string
  category: Category
  processor: string
  description?: string
  image?: string
  images?: string[]
  ram_options?: string[]
  ssd_options?: string[]
  price_range?: string
  specs?: string[]
  rating?: number
  review_count?: number
  is_featured?: boolean
  is_best_seller?: boolean
  discount_percentage?: number
  discount_start_date?: string
  discount_end_date?: string
  is_discount_active?: boolean
  variants?: ProductVariantWithStock[]
  total_stock?: number
  created_at?: string
  updated_at?: string
}

export interface ProductVariantWithStock extends ProductVariant {
  stock_quantity?: number
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
}

// Stock Management Types
export interface StockFormData {
  product_id: string
  variant_id?: string
  quantity: number
}

export interface StockUpdateData {
  id: number
  quantity: number
}

export interface StockWithProduct extends Stock {
  product?: {
    id: string
    name: string
    image?: string
  }
  variant?: {
    id: string
    ram: string
    ssd: string
    price: number
  }
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  image: string
  created_at?: string
  updated_at?: string
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: string
  created_at?: string
  updated_at?: string
}

// Order Types
export interface Order {
  id: string
  order_number: string
  user_id?: string
  customer_name: string
  customer_phone?: string
  customer_address: string
  delivery_option: string
  total_amount: number
  status: string
  whatsapp_message?: string
  admin_notes?: string
  payment_status?: string
  created_at?: string
  updated_at?: string
  user?: User
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id?: string
  quantity: number
  unit_price: number
  total_price: number
  ram?: string
  ssd?: string
  created_at?: string
  product?: ProductWithStock
  variant?: ProductVariant
}

// Settings Types
export interface Settings {
  id: string
  key: string
  value?: string
  type: string
  category: string
  description?: string
  created_at?: string
  updated_at?: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Validation Types
export interface ValidationErrors {
  [key: string]: string
}

// UI State Types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface TableState {
  page: number
  limit: number
  search: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  filters: Record<string, any>
}

// Action Types
export interface ActionButton {
  label: string
  action: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
} 