import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        stock:stock(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Pastikan ram_options dan ssd_options tidak null
    if (product) {
      if (!product.ram_options) product.ram_options = [];
      if (!product.ssd_options) product.ssd_options = [];
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Allow all product fields to be updated including discount fields
    const updateData: any = {
      name: body.name,
      category_id: body.category_id,
      processor: body.processor,
      description: body.description,
      image: body.image,
      images: body.images,
      ram_options: body.ram_options,
      ssd_options: body.ssd_options,
      price_range: body.price_range,
      specs: body.specs,
      discount_percentage: body.discount_percentage || 0,
      discount_start_date: body.discount_start_date || null,
      discount_end_date: body.discount_end_date || null,
      is_discount_active: body.is_discount_active || false,
    }

    // Update product data
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 400 }
      )
    }

    // --- VARIANT UPDATE LOGIC (SAFE) ---
    // Ambil semua varian lama dari database
    const { data: oldVariants, error: fetchOldVariantsError } = await supabaseAdmin
      .from('product_variants')
      .select('id')
      .eq('product_id', id)
    if (fetchOldVariantsError) {
      console.error('Error fetching old variants:', fetchOldVariantsError)
      return NextResponse.json(
        { error: 'Gagal mengambil varian lama.' },
        { status: 500 }
      )
    }
    const oldIds = (oldVariants || []).map((v: any) => v.id)
    const newIds = (body.variants || []).filter((v: any) => v.id).map((v: any) => v.id)

    // 1. Update varian yang ada
    for (const v of (body.variants || [])) {
      if (v.id) {
        const { error: updateVariantError } = await supabaseAdmin
          .from('product_variants')
          .update({
            ram: v.ram,
            ssd: v.ssd,
            price: v.price,
            stock: v.stock,
          })
          .eq('id', v.id)
        if (updateVariantError) {
          console.error('Error updating variant:', updateVariantError)
          return NextResponse.json(
            { error: 'Gagal mengupdate varian.' },
            { status: 500 }
          )
        }
      }
    }
    // 2. Insert varian baru
    const variantsToInsert = (body.variants || []).filter((v: any) => !v.id).map((v: any) => ({
      product_id: id,
      ram: v.ram,
      ssd: v.ssd,
      price: v.price,
      stock: v.stock,
    }))
    if (variantsToInsert.length > 0) {
      const { error: insertVariantsError } = await supabaseAdmin
        .from('product_variants')
        .insert(variantsToInsert)
      if (insertVariantsError) {
        console.error('Error inserting new variants:', insertVariantsError)
        return NextResponse.json(
          { error: 'Gagal menyimpan varian baru.' },
          { status: 500 }
        )
      }
    }
    // 3. Hapus varian lama yang tidak ada di data baru (jika tidak ada constraint)
    const idsToDelete = oldIds.filter((oid: string) => !newIds.includes(oid))
    if (idsToDelete.length > 0) {
      // Coba hapus, jika gagal, abaikan (bisa jadi ada constraint)
      const { error: deleteVariantsError } = await supabaseAdmin
        .from('product_variants')
        .delete()
        .in('id', idsToDelete)
      if (deleteVariantsError) {
        console.warn('Warning: Gagal menghapus varian lama (mungkin ada constraint):', deleteVariantsError)
        // Tidak return error, lanjutkan proses
      }
    }
    // --- END VARIANT UPDATE LOGIC (SAFE) ---

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // First delete related product variants
    const { error: variantsError } = await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('product_id', id)

    if (variantsError) {
      console.error('Error deleting product variants:', variantsError)
      return NextResponse.json(
        { error: 'Failed to delete product variants' },
        { status: 400 }
      )
    }

    // Then delete the product
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Only allow specific fields to be updated for status changes
    const allowedFields = ['is_featured', 'is_best_seller', 'is_discount_active']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 