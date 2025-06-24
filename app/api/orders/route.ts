import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { fetchOrders } from '@/lib/services/fetchOrders'

function generateOrderNumber() {
  const now = new Date()
  return `ORD-${now.getFullYear()}-${now.getTime()}`
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const {
      customer_name,
      customer_phone,
      customer_address,
      delivery_option,
      total_amount,
      items
    } = body

    // Validation
    if (!customer_name || !customer_address || !delivery_option || !total_amount || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        user_id: user.id,
        customer_name,
        customer_phone,
        customer_address,
        delivery_option,
        total_amount,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      ram: item.ram,
      ssd: item.ssd
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      // Rollback order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Create initial status history
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: 'pending',
        notes: 'Order created',
        changed_by: user.id
      })

    if (historyError) {
      console.error('Status history creation error:', historyError)
      // Don't fail the request for this, just log it
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        items: orderItems
      }
    })

  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const orders = await fetchOrders({ limit, offset })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 