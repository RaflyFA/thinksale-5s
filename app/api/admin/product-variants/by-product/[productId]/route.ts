import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await params;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('price', { ascending: true });
    
    if (error) {
      console.error('Error fetching product variants:', error);
      return NextResponse.json({ error: 'Gagal mengambil varian produk' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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