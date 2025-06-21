import { supabase } from '../supabase/client'
import type { Category } from '../types'

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  image: string
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return categories?.map((category: DatabaseCategory) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image
    })) || []
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return null
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image
    }
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error)
    return null
  }
} 