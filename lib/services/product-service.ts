import { supabase } from '../supabase/client'
import type { Product } from '../types'

export interface DatabaseProduct {
  id: string
  name: string
  description: string
  processor: string
  category_id: string
  image: string
  images: string[]
  ram_options: string[]
  ssd_options: string[]
  price_range: string
  specs: string[]
  rating: number
  review_count: number
  is_featured: boolean
  is_best_seller: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseVariant {
  id: string
  product_id: string
  ram: string
  ssd: string
  price: number
  stock: number
  created_at: string
  updated_at: string
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants (*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: product.category.image
      },
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      variants: product.product_variants?.map((variant: DatabaseVariant) => ({
        id: variant.id,
        ram: variant.ram,
        ssd: variant.ssd,
        price: variant.price,
        stock: variant.stock,
        created_at: variant.created_at,
        updated_at: variant.updated_at
      })) || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || []
  } catch (error) {
    console.error('Error in getProducts:', error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants (*)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: product.category.image
      },
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      variants: product.product_variants?.map((variant: DatabaseVariant) => ({
        id: variant.id,
        ram: variant.ram,
        ssd: variant.ssd,
        price: variant.price,
        stock: variant.stock,
        created_at: variant.created_at,
        updated_at: variant.updated_at
      })) || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || []
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

export async function getBestSellerProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants (*)
      `)
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching best seller products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: product.category.image
      },
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      variants: product.product_variants?.map((variant: DatabaseVariant) => ({
        id: variant.id,
        ram: variant.ram,
        ssd: variant.ssd,
        price: variant.price,
        stock: variant.stock,
        created_at: variant.created_at,
        updated_at: variant.updated_at
      })) || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || []
  } catch (error) {
    console.error('Error in getBestSellerProducts:', error)
    return []
  }
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants (*)
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,processor.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: product.category.image
      },
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      variants: product.product_variants?.map((variant: DatabaseVariant) => ({
        id: variant.id,
        ram: variant.ram,
        ssd: variant.ssd,
        price: variant.price,
        stock: variant.stock,
        created_at: variant.created_at,
        updated_at: variant.updated_at
      })) || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || []
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}

export async function getTopRatedProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants (*)
      `)
      .not('rating', 'is', null)
      .gte('rating', 4.5)
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching top rated products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: product.category.image
      },
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      variants: product.product_variants?.map((variant: DatabaseVariant) => ({
        id: variant.id,
        ram: variant.ram,
        ssd: variant.ssd,
        price: variant.price,
        stock: variant.stock,
        created_at: variant.created_at,
        updated_at: variant.updated_at
      })) || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || []
  } catch (error) {
    console.error('Error in getTopRatedProducts:', error)
    return []
  }
}

export async function getInStockProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_variants (*)
      `)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching in-stock products:', error)
      return []
    }

    // Filter products that have at least one variant with stock > 0
    const inStockProducts = products?.filter((product: any) => {
      return product.product_variants?.some((variant: DatabaseVariant) => variant.stock > 0)
    }) || []

    return inStockProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        image: product.category.image
      },
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      variants: product.product_variants?.map((variant: DatabaseVariant) => ({
        id: variant.id,
        ram: variant.ram,
        ssd: variant.ssd,
        price: variant.price,
        stock: variant.stock,
        created_at: variant.created_at,
        updated_at: variant.updated_at
      })) || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      created_at: product.created_at,
      updated_at: product.updated_at
    }))
  } catch (error) {
    console.error('Error in getInStockProducts:', error)
    return []
  }
} 