import { supabase } from '../supabase/client'
import type { User } from '../supabase/admin'

export async function fetchUsers({ limit = 20, offset = 0 } = {}): Promise<User[]> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, image, role, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return users || []
  } catch (error) {
    console.error('Error in fetchUsers:', error)
    return []
  }
} 