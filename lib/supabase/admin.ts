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
    const [productsCount, usersCount, ordersCount, variantsCount] = await Promise.all([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('product_variants').select('*', { count: 'exact', head: true })
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

    // Get all product variants with product info for stock calculation
    const { data: variantsData } = await supabaseAdmin
      .from('product_variants')
      .select(`
        id,
        product_id,
        ram,
        ssd,
        price,
        stock,
        product:products(id, name)
      `)

    // Buat map: product_id -> array stok varian
    const productVariantStockMap: Record<string, number[]> = {}
    for (const v of variantsData || []) {
      if (!productVariantStockMap[v.product_id]) {
        productVariantStockMap[v.product_id] = []
      }
      productVariantStockMap[v.product_id].push(v.stock ?? 0)
    }

    // Produk stok tersedia: minimal 1 varian stock > 0
    const inStockProductCount = Object.values(productVariantStockMap).filter(
      (stockArr) => stockArr.length > 0 && stockArr.some(s => s > 0)
    ).length
    // Produk stok kosong: semua varian stock === 0 atau tidak ada varian
    const outOfStockProductCount = Object.values(productVariantStockMap).filter(
      (stockArr) => stockArr.length === 0 || stockArr.every(s => s === 0)
    ).length
    // Total stok: jumlah seluruh stock dari semua varian
    const totalStock = (variantsData?.reduce((sum, v) => sum + (v.stock || 0), 0)) || 0

    // Get out-of-stock variants (stock === 0)
    const outOfStockVariants = (variantsData || []).filter(v => (v.stock ?? 0) === 0)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
      .slice(0, 10)

    // Transform out-of-stock variants to alerts
    const stockAlerts = outOfStockVariants.map(v => {
      let productId = ''
      let productName = 'Unknown Product'
      if (v.product && Array.isArray(v.product) && v.product.length > 0) {
        productId = v.product[0]?.id || ''
        productName = v.product[0]?.name || 'Unknown Product'
      } else if (v.product && typeof v.product === 'object' && !Array.isArray(v.product)) {
        productId = (v.product as any).id || ''
        productName = (v.product as any).name || 'Unknown Product'
      }
      return {
        id: v.id,
        product_id: productId,
        variant_id: v.id,
        quantity: v.stock ?? 0,
        product_name: productName,
        variant_info: `${v.ram || ''} | ${v.ssd || ''}`,
        alert_level: 'critical'
      }
    })

    return {
      totalProducts: productsCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalOrders: ordersCount.count || 0,
      totalRevenue,
      totalStock,
      inStockProductCount,
      outOfStockProductCount,
      recentOrders: recentOrders || [],
      stockAlerts
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
} 