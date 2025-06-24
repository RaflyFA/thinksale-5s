import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/utils/auth'
import { getAllProductsWithStock, createProductWithVariants } from '@/lib/services/admin-product-service'

// Validation schema for POST request
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().min(1, 'Category is required'),
  processor: z.string().min(1, 'Processor is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  ramOptions: z.array(z.string()).optional(),
  ssdOptions: z.array(z.string()).optional(),
  price_range: z.string().optional(),
  variants: z.array(z.object({
    ram: z.string(),
    ssd: z.string(),
    price: z.number(),
    stock: z.number(),
  })),
  specs: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  is_best_seller: z.boolean().optional(),
  discount_percentage: z.number().optional(),
  discount_start_date: z.string().optional(),
  discount_end_date: z.string().optional(),
  is_discount_active: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const query = searchParams.get('query')
    const category = searchParams.get('category')
    const stock = searchParams.get('stock')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    let products = await getAllProductsWithStock()
    
    // Apply search filter
    if (query) {
      const searchTerm = query.toLowerCase()
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.processor.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.category && product.category.name.toLowerCase().includes(searchTerm))
      )
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      products = products.filter(product => product.category_id === category)
    }
    
    // Apply stock filter
    if (stock && stock !== 'all') {
      products = products.filter(product => {
        const totalStock = product.total_stock || 0
        switch (stock) {
          case 'in_stock':
            return totalStock > 0
          case 'out_of_stock':
            return totalStock === 0
          default:
            return true
        }
      })
    }
    
    // Apply sorting
    products.sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'price_range':
          aValue = a.price_range || ''
          bValue = b.price_range || ''
          break
        case 'rating':
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        case 'total_stock':
          aValue = a.total_stock || 0
          bValue = b.total_stock || 0
          break
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + limit)
    
    return NextResponse.json(paginatedProducts)
  } catch (error) {
    console.error('Error in GET /api/admin/products:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message.includes('Forbidden')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = createProductSchema.parse(body)
    
    // Create product with variants
    const product = await createProductWithVariants(validatedData)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/products:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message.includes('Forbidden')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 