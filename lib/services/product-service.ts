import { supabase } from '../supabase/client'
import type { ProductListItem } from '../types/index'
import type { Product, ProductVariant } from '../supabase/admin'

// Base product query with common fields
const baseProductQuery = `
  id, name, image, price_range, category:categories(id, name, slug)
`

/**
 * Get all products with pagination
 */
export async function fetchProducts({ limit = 20, offset = 0 } = {}): Promise<ProductListItem[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      priceRange: product.price_range,
      category: product.category || null,
    })) || []
  } catch (error) {
    console.error('Error in fetchProducts:', error)
    return []
  }
}

/**
 * Get featured products
 */
export async function fetchFeaturedProducts({ limit = 8, offset = 0 } = {}): Promise<ProductListItem[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      priceRange: product.price_range,
      category: product.category || null,
    })) || []
  } catch (error) {
    console.error('Error in fetchFeaturedProducts:', error)
    return []
  }
}

/**
 * Get best seller products
 */
export async function fetchBestSellerProducts({ limit = 8, offset = 0 } = {}): Promise<ProductListItem[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching best seller products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      priceRange: product.price_range,
      category: product.category || null,
    })) || []
  } catch (error) {
    console.error('Error in fetchBestSellerProducts:', error)
    return []
  }
}

/**
 * Get top rated products
 */
export async function fetchTopRatedProducts({ limit = 8, offset = 0 } = {}): Promise<ProductListItem[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .not('rating', 'is', null)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching top rated products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      priceRange: product.price_range,
      category: product.category || null,
    })) || []
  } catch (error) {
    console.error('Error in fetchTopRatedProducts:', error)
    return []
  }
}

/**
 * Get in-stock products (products with available stock)
 */
export async function fetchInStockProducts({ limit = 8, offset = 0 } = {}): Promise<ProductListItem[]> {
  try {
    // Get products that have stock > 0
    const { data: stockData, error: stockError } = await supabase
      .from('stock')
      .select('product_id')
      .gt('quantity', 0)

    if (stockError) {
      console.error('Error fetching stock data:', stockError)
      return []
    }

    const productIds = [...new Set(stockData?.map(s => s.product_id) || [])]

    if (productIds.length === 0) {
      return []
    }

    const { data: products, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .in('id', productIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching in stock products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      priceRange: product.price_range,
      category: product.category || null,
    })) || []
  } catch (error) {
    console.error('Error in fetchInStockProducts:', error)
    return []
  }
}

/**
 * Search products
 */
export async function searchProducts(searchTerm: string, { limit = 20, offset = 0 } = {}): Promise<ProductListItem[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,processor.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      priceRange: product.price_range,
      category: product.category || null,
    })) || []
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}

/**
 * Get product detail by ID
 */
export async function fetchProductDetail(id: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id, name, processor, description, image, images, ram_options, ssd_options, price_range, specs, rating, review_count, is_featured, is_best_seller, discount_percentage, discount_start_date, discount_end_date, is_discount_active, created_at, updated_at,
        category:categories(id, name, slug, image),
        variants:product_variants(id, ram, ssd, price, created_at, updated_at)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product detail:', error)
      return null
    }

    if (!product) return null

    return {
      id: product.id,
      name: product.name,
      processor: product.processor,
      description: product.description,
      image: product.image,
      images: product.images || [],
      ramOptions: product.ram_options || [],
      ssdOptions: product.ssd_options || [],
      priceRange: product.price_range,
      specs: product.specs || [],
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      discount_percentage: product.discount_percentage || null,
      discount_start_date: product.discount_start_date || null,
      discount_end_date: product.discount_end_date || null,
      is_discount_active: product.is_discount_active || false,
      created_at: product.created_at,
      updated_at: product.updated_at,
      category: product.category || null,
      variants: product.variants || [],
    }
  } catch (error) {
    console.error('Error in fetchProductDetail:', error)
    return null
  }
} 