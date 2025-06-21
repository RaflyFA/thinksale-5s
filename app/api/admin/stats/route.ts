import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
} 