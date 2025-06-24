import { supabase } from '../supabase/client'
import type { Category } from '../supabase/admin'

export async function fetchCategories({ limit = 50, offset = 0 } = {}): Promise<Category[]> {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, image')
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error('Error in fetchCategories:', error)
    return []
  }
} 