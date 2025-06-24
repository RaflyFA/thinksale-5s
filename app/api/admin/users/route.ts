import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/utils/auth'
import { fetchUsers } from '@/lib/services/fetchUsers'
import { searchUsers } from '@/lib/services/searchUsers'

// Validation schema for search
const searchSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['all', 'user', 'admin']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
    // Validate search params
    const searchData = searchSchema.parse({
      query: searchParams.get('query'),
      role: searchParams.get('role') || 'all',
    })
    
    // Use searchUsers if there's a query or role filter, otherwise use fetchUsers
    const users = searchData.query || searchData.role !== 'all' 
      ? await searchUsers({ limit, offset, ...searchData })
      : await fetchUsers({ limit, offset })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid search parameters', 
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