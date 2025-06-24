import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { fetchOrderDetail } from '@/lib/services/fetchOrderDetail'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const order = await fetchOrderDetail(id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { status, admin_notes, whatsapp_message } = body

    // Update order
    const updateData: any = {}
    if (status) updateData.status = status
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes
    if (whatsapp_message !== undefined) updateData.whatsapp_message = whatsapp_message

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    // If status changed, add to history
    if (status) {
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: params.id,
          status,
          notes: admin_notes || `Status changed to ${status}`,
          changed_by: user.id
        })

      if (historyError) {
        console.error('Status history creation error:', historyError)
      }
    }

    return NextResponse.json({ success: true, order })

  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 