import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role key for full access
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types based on database schema
export interface Category {
  id: string
  name: string
  slug: string
  image: string
  created_at?: string
  updated_at?: string
}

export interface ProductVariant {
  id: string
  product_id: string
  ram: string
  ssd: string
  price: number
  discount_percentage?: number
  discount_start_date?: string
  discount_end_date?: string
  is_discount_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Stock {
  id: number
  product_id: string
  variant_id?: string
  quantity: number
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  name: string
  category_id: string
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
  created_at?: string
  updated_at?: string
  category?: Category
  variants?: ProductVariant[]
  stock?: Stock[]
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: string
  created_at?: string
  updated_at?: string
}

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
  product?: Product
  variant?: ProductVariant
}

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

// Statistics
export async function getDashboardStats() {
  try {
    // Get counts
    const [productsCount, usersCount, ordersCount, stockCount] = await Promise.all([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('stock').select('*', { count: 'exact', head: true })
    ])

    // Get total revenue
    const { data: revenueData } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .not('total_amount', 'is', null)

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // Get recent orders for dashboard
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        customer_name,
        payment_status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get low stock alerts
    const { data: lowStockItems } = await supabaseAdmin
      .from('stock')
      .select(`
        id,
        quantity,
        product:products(id, name),
        variant:product_variants(id, ram, ssd)
      `)
      .lte('quantity', 10)
      .order('quantity', { ascending: true })
      .limit(10)

    // Transform low stock items to alerts
    const stockAlerts = lowStockItems?.map(item => ({
      id: item.id,
      product_id: item.product?.id || '',
      variant_id: item.variant?.id,
      quantity: item.quantity,
      product_name: item.product?.name || 'Unknown Product',
      variant_info: item.variant ? `${item.variant.ram} | ${item.variant.ssd}` : undefined,
      alert_level: item.quantity === 0 ? 'critical' : item.quantity <= 5 ? 'low' : 'warning'
    })) || []

    // Count low stock items
    const lowStockCount = stockAlerts.length

    return {
      totalProducts: productsCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalOrders: ordersCount.count || 0,
      totalRevenue,
      totalStock: stockCount.count || 0,
      lowStockItems: lowStockCount,
      recentOrders: recentOrders || [],
      stockAlerts
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
} 