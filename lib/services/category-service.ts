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

    return categories || []
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

export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category | null> {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return null
    }

    return category
  } catch (error) {
    console.error('Error in createCategory:', error)
    return null
  }
}

export async function updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return null
    }

    return category
  } catch (error) {
    console.error('Error in updateCategory:', error)
    return null
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteCategory:', error)
    return false
  }
} 