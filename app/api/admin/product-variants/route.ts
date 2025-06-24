import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    if (!body.ram || !body.ssd || typeof body.price !== 'number' || typeof body.stock !== 'number') {
      return NextResponse.json(
        { error: 'Field ram, ssd, price, stock wajib diisi' },
        { status: 400 }
      )
    }
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .insert({
        product_id: body.product_id,
        ram: body.ram,
        ssd: body.ssd,
        price: body.price,
        stock: body.stock,
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