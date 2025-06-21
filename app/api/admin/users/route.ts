import { NextRequest, NextResponse } from 'next/server'
import { getUsers, searchUsers } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const role = searchParams.get('role') || ''

    let users

    if (query || (role && role !== 'all')) {
      users = await searchUsers(query, role)
    } else {
      users = await getUsers()
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
} 