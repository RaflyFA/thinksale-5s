import { supabaseAdmin } from '@/lib/supabase/admin'
import type { 
  ProductWithStock, 
  ProductFormData, 
  ProductVariantForm,
  ApiResponse,
  PaginatedResponse 
} from '@/lib/types/admin'

// Define types for database responses
interface ProductVariantDB {
  id: string
  product_id: string
  ram: string
  ssd: string
  price: number
  stock: number
  created_at?: string
  updated_at?: string
}

interface StockDB {
  id: number
  product_id: string
  variant_id: string
  quantity: number
  created_at?: string
  updated_at?: string
}

interface ProductDB {
  id: string
  name: string
  category_id: string
  processor: string
  description?: string
  image?: string
  images?: string[]
  specs?: string[]
  rating?: number
  review_count?: number
  is_featured?: boolean
  is_best_seller?: boolean
  discount_percentage?: number
  discount_start_date?: string
  discount_end_date?: string
  is_discount_active?: boolean
  created_at?: string
  updated_at?: string
  category?: {
    id: string
    name: string
    slug: string
    image: string
  }
  variants?: ProductVariantDB[]
  stock?: StockDB[]
}

/**
 * Get all products with stock information for admin
 */
export async function getAllProductsWithStock(): Promise<ProductWithStock[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        stock:stock(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products with stock:', error)
      throw error
    }

    // Process stock information
    const productsWithStock = (data as ProductDB[])?.map((product: ProductDB) => {
      const variants = product.variants?.map((variant: ProductVariantDB) => {
        const variantStock = product.stock?.find((s: StockDB) => s.variant_id === variant.id)
        return {
          ...variant,
          stock_quantity: variantStock?.quantity || 0,
          stock_status: getStockStatus(variantStock?.quantity || 0)
        }
      })

      const totalStock = product.stock?.reduce((sum: number, s: StockDB) => sum + s.quantity, 0) || 0

      return {
        ...product,
        category: product.category || { id: '', name: '', slug: '', image: '' },
        variants,
        total_stock: totalStock
      } as ProductWithStock
    })

    return productsWithStock || []
  } catch (error) {
    console.error('Error in getAllProductsWithStock:', error)
    throw error
  }
}

/**
 * Get product by ID with stock information
 */
export async function getProductWithStockById(id: string): Promise<ProductWithStock | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        stock:stock(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product with stock:', error)
      throw error
    }

    if (!data) return null

    const productData = data as ProductDB

    // Process stock information
    const variants = productData.variants?.map((variant: ProductVariantDB) => {
      const variantStock = productData.stock?.find((s: StockDB) => s.variant_id === variant.id)
      return {
        ...variant,
        stock_quantity: variantStock?.quantity || 0,
        stock_status: getStockStatus(variantStock?.quantity || 0)
      }
    })

    const totalStock = productData.stock?.reduce((sum: number, s: StockDB) => sum + s.quantity, 0) || 0

    return {
      ...productData,
      category: productData.category || { id: '', name: '', slug: '', image: '' },
      variants,
      total_stock: totalStock
    } as ProductWithStock
  } catch (error) {
    console.error('Error in getProductWithStockById:', error)
    throw error
  }
}

/**
 * Create new product with variants and stock
 */
export async function createProductWithVariants(productData: ProductFormData): Promise<ProductWithStock> {
  try {
    // Start transaction
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        name: productData.name,
        category_id: productData.category_id,
        processor: productData.processor,
        description: productData.description,
        image: productData.imageUrl,
        images: [productData.imageUrl],
        specs: productData.specs,
        discount_percentage: productData.discount_percentage,
        discount_start_date: productData.discount_start_date,
        discount_end_date: productData.discount_end_date,
        is_discount_active: productData.is_discount_active,
        is_featured: productData.is_featured,
        is_best_seller: productData.is_best_seller
      })
      .select()
      .single()

    if (productError) {
      console.error('Error creating product:', productError)
      throw productError
    }

    if (!product) {
      throw new Error('Failed to create product')
    }

    // Create variants with all fields
    const variantPromises = productData.variants.map(variant =>
      supabaseAdmin
        .from('product_variants')
        .insert({
          product_id: product.id,
          ram: variant.ram,
          ssd: variant.ssd,
          price: variant.price,
          stock: variant.stock || 0
        })
        .select()
        .single()
    )

    const variantResults = await Promise.all(variantPromises)
    const variants = variantResults.map(result => {
      if (result.error) throw result.error
      return result.data
    })

    // Create stock records for each variant (sesuai schema)
    const stockPromises = variants.map(variant =>
      supabaseAdmin
        .from('stock')
        .insert({
          product_id: product.id,
          variant_id: variant.id,
          quantity: variant.stock || 0
        })
    )
    await Promise.all(stockPromises)

    // Return the complete product with stock
    return await getProductWithStockById(product.id) as ProductWithStock
  } catch (error) {
    console.error('Error in createProductWithVariants:', error)
    throw error
  }
}

/**
 * Update product with variants and stock
 */
export async function updateProductWithVariants(
  productId: string, 
  productData: ProductFormData
): Promise<ProductWithStock> {
  try {
    // Update product
    const { error: productError } = await supabaseAdmin
      .from('products')
      .update({
        name: productData.name,
        category_id: productData.category_id,
        processor: productData.processor,
        description: productData.description,
        image: productData.imageUrl,
        images: [productData.imageUrl],
        price_range: calculatePriceRange(productData.variants),
        specs: productData.specs,
        discount_percentage: productData.discount_percentage,
        discount_start_date: productData.discount_start_date,
        discount_end_date: productData.discount_end_date,
        is_discount_active: productData.is_discount_active,
        is_featured: productData.is_featured,
        is_best_seller: productData.is_best_seller,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (productError) {
      console.error('Error updating product:', productError)
      throw productError
    }

    // Delete existing variants and stock
    await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('product_id', productId)

    await supabaseAdmin
      .from('stock')
      .delete()
      .eq('product_id', productId)

    // Create new variants with all fields
    const variantPromises = productData.variants.map(variant =>
      supabaseAdmin
        .from('product_variants')
        .insert({
          product_id: productId,
          ram: variant.ram,
          ssd: variant.ssd,
          price: variant.price,
          stock: variant.stock || 0
        })
        .select()
        .single()
    )

    const variantResults = await Promise.all(variantPromises)
    const variants = variantResults.map(result => {
      if (result.error) throw result.error
      return result.data
    })

    // Create stock records for each variant
    const stockPromises = variants.map(variant =>
      supabaseAdmin
        .from('stock')
        .insert({
          product_id: productId,
          variant_id: variant.id,
          quantity: variant.stock || 0
        })
    )

    await Promise.all(stockPromises)

    // Return the updated product with stock
    return await getProductWithStockById(productId) as ProductWithStock
  } catch (error) {
    console.error('Error in updateProductWithVariants:', error)
    throw error
  }
}

/**
 * Delete product and all related data
 */
export async function deleteProductWithVariants(productId: string): Promise<void> {
  try {
    // Delete in order: stock -> variants -> product
    await supabaseAdmin
      .from('stock')
      .delete()
      .eq('product_id', productId)

    await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('product_id', productId)

    await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId)
  } catch (error) {
    console.error('Error in deleteProductWithVariants:', error)
    throw error
  }
}

/**
 * Update stock for a specific variant
 */
export async function updateVariantStock(
  productId: string,
  variantId: string,
  quantity: number
): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('stock')
      .upsert({
        product_id: productId,
        variant_id: variantId,
        quantity,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating variant stock:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in updateVariantStock:', error)
    throw error
  }
}

/**
 * Get products with low stock
 */
export async function getProductsWithLowStock(threshold: number = 10): Promise<ProductWithStock[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('stock')
      .select(`
        quantity,
        product:products(
          *,
          category:categories(*),
          variants:product_variants(*)
        )
      `)
      .lte('quantity', threshold)
      .order('quantity', { ascending: true })

    if (error) {
      console.error('Error fetching products with low stock:', error)
      throw error
    }

    // Group by product and calculate totals
    const productMap = new Map()
    
    data?.forEach((stockItem: any) => {
      const product = stockItem.product as ProductDB
      if (!product) return

      if (!productMap.has(product.id)) {
        productMap.set(product.id, {
          ...product,
          variants: product.variants?.map((variant: ProductVariantDB) => ({
            ...variant,
            stock_quantity: 0,
            stock_status: 'out_of_stock'
          })),
          total_stock: 0
        })
      }

      const productWithStock = productMap.get(product.id)
      productWithStock.total_stock += stockItem.quantity

      // Update variant stock
      if (stockItem.product?.variants) {
        productWithStock.variants = productWithStock.variants.map((variant: ProductVariantDB) => {
          if (variant.id === stockItem.variant_id) {
            return {
              ...variant,
              stock_quantity: stockItem.quantity,
              stock_status: getStockStatus(stockItem.quantity)
            }
          }
          return variant
        })
      }
    })

    return Array.from(productMap.values())
  } catch (error) {
    console.error('Error in getProductsWithLowStock:', error)
    throw error
  }
}

// Helper functions
function calculatePriceRange(variants: ProductVariantForm[]): string {
  if (variants.length === 0) return ''
  
  const prices = variants.map(v => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  return minPrice === maxPrice ? 
    minPrice.toString() : 
    `${minPrice} - ${maxPrice}`
}

function getStockStatus(quantity: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity === 0) return 'out_of_stock'
  if (quantity <= 5) return 'low_stock'
  return 'in_stock'
} 