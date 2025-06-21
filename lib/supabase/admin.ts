import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role key for full access
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Types based on database schema
export interface Category {
  id: string
  name: string
  slug: string
  image: string
}

export interface Product {
  id: string
  name: string
  category_id: string
  processor: string
  description: string | null
  image: string | null
  images: string[] | null
  ram_options: string[] | null
  ssd_options: string[] | null
  price_range: string | null
  specs: string[] | null
  is_featured: boolean
  is_best_seller: boolean
  rating: number | null
  review_count: number | null
  created_at: string
  updated_at: string
  category?: Category
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  ram: string | null
  ssd: string | null
  price: number | null
}

export interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  total: number | null
  status: string | null
  created_at: string
  updated_at: string
  user?: User
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  price: number
  product?: Product
  variant?: ProductVariant
}

// Products
export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data as Product[]
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    throw error
  }

  return data as Product
}

// Categories
export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data as Category[]
}

// Users
export async function getUsers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    throw error
  }

  return data as User[]
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    throw error
  }

  return data as User
}

// Orders
export async function getOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      user:users(*),
      items:order_items(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    throw error
  }

  return data as Order[]
}

export async function getOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      user:users(*),
      items:order_items(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    throw error
  }

  return data as Order
}

// Statistics
export async function getDashboardStats() {
  // Get counts
  const [productsCount, usersCount, ordersCount] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true })
  ])

  // Get total revenue
  const { data: revenueData } = await supabaseAdmin
    .from('orders')
    .select('total')
    .not('total', 'is', null)

  const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

  // Get recent orders for dashboard
  const { data: recentOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      user:users(name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalProducts: productsCount.count || 0,
    totalUsers: usersCount.count || 0,
    totalOrders: ordersCount.count || 0,
    totalRevenue,
    recentOrders: recentOrders || []
  }
}

// Search and filter functions
export async function searchProducts(query: string, category?: string) {
  try {
    let queryBuilder = supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)

    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query.trim()}%,processor.ilike.%${query.trim()}%`)
    }

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category_id', category)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      throw error
    }

    return data as Product[]
  } catch (error) {
    console.error('Error in searchProducts:', error)
    throw error
  }
}

export async function searchOrders(query: string, status?: string) {
  try {
    let queryBuilder = supabaseAdmin
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          product:products(*),
          variant:product_variants(*)
        )
      `)

    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`id.ilike.%${query.trim()}%`)
    }

    if (status && status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching orders:', error)
      throw error
    }

    return data as Order[]
  } catch (error) {
    console.error('Error in searchOrders:', error)
    throw error
  }
}

export async function searchUsers(query: string, role?: string) {
  try {
    let queryBuilder = supabaseAdmin
      .from('users')
      .select('*')

    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query.trim()}%,email.ilike.%${query.trim()}%`)
    }

    if (role && role !== 'all') {
      queryBuilder = queryBuilder.eq('role', role)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching users:', error)
      throw error
    }

    return data as User[]
  } catch (error) {
    console.error('Error in searchUsers:', error)
    throw error
  }
} 