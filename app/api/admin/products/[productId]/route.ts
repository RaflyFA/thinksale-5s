import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  category_id: z.string().uuid('ID Kategori tidak valid'),
  processor: z.string().min(3, 'Nama prosesor minimal 3 karakter'),
  description: z.string().optional(),
  image: z.string().url('URL Gambar tidak valid'),
  images: z.array(z.string().url()).optional(),
  ram_options: z.array(z.string().min(1)),
  ssd_options: z.array(z.string().min(1)),
  price_range: z.string().min(1, 'Rentang harga wajib diisi'),
  specs: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(name),
        variants:product_variants(*)
      `)
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsedData = productSchema.parse(body);

    const { error } = await supabaseAdmin
      .from('products')
      .update(parsedData)
      .eq('id', productId);

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: 'Gagal memperbarui produk' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Produk berhasil diperbarui' }, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Data tidak valid', details: err.errors }, { status: 400 });
    }
    console.error('Internal server error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Delete variants first to avoid foreign key constraint violations
    const { error: variantError } = await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('product_id', productId);
    
    if (variantError) {
      console.error('Error deleting product variants:', variantError);
      return NextResponse.json({ error: 'Gagal menghapus varian produk' }, { status: 500 });
    }

    // Then delete the product
    const { error: productError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (productError) {
      console.error('Error deleting product:', productError);
      return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Produk berhasil dihapus' }, { status: 200 });
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
} 