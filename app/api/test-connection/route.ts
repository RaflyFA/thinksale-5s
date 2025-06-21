import { NextResponse } from 'next/server'
import { testSupabaseConnection, testDatabaseTables } from '@/lib/supabase/test-connection'

export async function GET() {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Test basic connection
    const connectionTest = await testSupabaseConnection()
    
    if (!connectionTest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to Supabase',
          error: 'Connection test failed'
        },
        { status: 500 }
      )
    }
    
    // Test all tables
    await testDatabaseTables()
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ API test connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 