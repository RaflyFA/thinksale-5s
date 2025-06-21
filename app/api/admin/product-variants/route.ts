import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .insert({
        product_id: body.product_id,
        ram: body.ram,
        ssd: body.ssd,
        price: body.price
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product variant:', error)
      return NextResponse.json(
        { error: 'Failed to create product variant' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/admin/product-variants:', error)
    return NextResponse.json(
      { error: 'Failed to create product variant' },
      { status: 500 }
    )
  }
} 