import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('product_id', productId);
    
    if (error) {
      console.error('Error deleting product variants:', error);
      return NextResponse.json({ error: 'Gagal menghapus varian produk' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Varian produk berhasil dihapus' }, { status: 200 });
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
} 