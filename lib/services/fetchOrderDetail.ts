import { supabase } from '../supabase/client'
import type { OrderDetail } from '../types/index'

export async function fetchOrderDetail(id: string): Promise<OrderDetail | null> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, order_number, status, total_amount, created_at,
        user:users(id, name, email),
        items:order_items(
          id, quantity, unit_price, total_price,
          product:products(id, name, image),
          variant:product_variants(id, ram, ssd)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching order detail:', error)
      return null
    }

    if (!order) return null

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      user: Array.isArray(order.user) ? order.user[0] || null : order.user || null,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        product: item.product || null,
        variant: item.variant || null,
      })),
    }
  } catch (error) {
    console.error('Error in fetchOrderDetail:', error)
    return null
  }
} 