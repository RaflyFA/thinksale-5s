import { supabase } from '../supabase/client'
import type { User } from '../supabase/admin'

export async function searchUsers({ 
  limit = 20, 
  offset = 0, 
  query = '', 
  role = 'all' 
} = {}): Promise<User[]> {
  try {
    let queryBuilder = supabase
      .from('users')
      .select('id, name, email, image, role, created_at, updated_at')

    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query.trim()}%,email.ilike.%${query.trim()}%`)
    }

    if (role && role !== 'all') {
      queryBuilder = queryBuilder.eq('role', role)
    }

    const { data: users, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error searching users:', error)
      return []
    }

    return users || []
  } catch (error) {
    console.error('Error in searchUsers:', error)
    return []
  }
} 