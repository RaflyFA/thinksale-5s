import { supabase } from './client'

export async function testSupabaseConnection() {
  try {
    // Test basic connection by querying a table
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Sample data:', data)
    return true
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// Test function that can be called from anywhere
export async function testDatabaseTables() {
  const tables = ['categories', 'products', 'product_variants', 'users', 'carts', 'cart_items', 'orders', 'order_items']
  
  console.log('🔍 Testing database tables...')
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`✅ Table ${table}: OK (${data?.length || 0} rows)`)
      }
    } catch (error) {
      console.log(`❌ Table ${table}: Connection error`)
    }
  }
} 