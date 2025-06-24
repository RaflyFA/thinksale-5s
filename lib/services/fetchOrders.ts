import { supabase } from '../supabase/client'
import type { Order } from '../supabase/admin'

export interface OrderListItem {
  id: string
  user_id: string
  total: number | null
  status: string | null
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export async function fetchOrders({ 
  limit = 20, 
  offset = 0, 
  query = '', 
  status = 'all' 
} = {}): Promise<OrderListItem[]> {
  try {
    let queryBuilder = supabase
      .from('orders')
      .select(`
        id, user_id, total, status, created_at, updated_at,
        user:users(id, name, email)
      `)

    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`id.ilike.%${query.trim()}%`)
    }

    if (status && status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status)
    }

    const { data: orders, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching orders:', error)
      return []
    }

    return (orders || []).map((order: any) => ({
      id: order.id,
      user_id: order.user_id,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      user: order.user || null,
    }))
  } catch (error) {
    console.error('Error in fetchOrders:', error)
    return []
  }
} 