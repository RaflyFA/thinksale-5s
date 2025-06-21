import { NextRequest, NextResponse } from 'next/server'
import { getOrders, searchOrders } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const status = searchParams.get('status') || ''

    let orders

    if (query || (status && status !== 'all')) {
      orders = await searchOrders(query, status)
    } else {
      orders = await getOrders()
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
} 