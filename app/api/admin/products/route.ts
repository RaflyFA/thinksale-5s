import { NextRequest, NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { type Product } from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }

    return NextResponse.json(products);
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/products:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.processor) {
      return NextResponse.json(
        { error: 'Name and processor are required' },
        { status: 400 }
      )
    }

    // For now, we'll use a default category ID
    // In a real app, you'd want to get the actual category ID from the categories table
    const categoryId = body.category_id || 'default-category-id'

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: body.name,
        category_id: categoryId,
        processor: body.processor,
        description: body.description,
        image: body.image,
        images: body.images,
        ram_options: body.ram_options,
        ssd_options: body.ssd_options,
        price_range: body.price_range,
        specs: body.specs,
        is_featured: body.is_featured || false,
        is_best_seller: body.is_best_seller || false,
        rating: body.rating,
        review_count: body.review_count || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/admin/products:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 