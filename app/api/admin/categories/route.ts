import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/utils/auth'
import { fetchCategories } from '@/lib/services/fetchCategories'

// Validation schema for POST request
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().url().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
    const categories = await fetchCategories({ limit, offset })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error)
    
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
    const validatedData = createCategorySchema.parse(body)
    
    // TODO: Call service to create category
    // const category = await createCategory(validatedData)
    
    return NextResponse.json({ message: 'Category created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error)
    
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