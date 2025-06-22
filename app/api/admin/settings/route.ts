import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true })

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Transform settings to grouped format
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {}
      }
      
      // Parse value based on type
      let parsedValue = setting.value
      if (setting.type === 'boolean') {
        parsedValue = setting.value === 'true'
      } else if (setting.type === 'number') {
        parsedValue = Number(setting.value)
      } else if (setting.type === 'json') {
        try {
          parsedValue = JSON.parse(setting.value || '{}')
        } catch {
          parsedValue = {}
        }
      }
      
      acc[setting.category][setting.key] = parsedValue
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(groupedSettings)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.settings || typeof body.settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const updates = []
    
    // Process each setting update
    for (const [key, value] of Object.entries(body.settings)) {
      // Determine type and convert value to string
      let type = 'string'
      let stringValue = String(value)
      
      if (typeof value === 'boolean') {
        type = 'boolean'
        stringValue = value ? 'true' : 'false'
      } else if (typeof value === 'number') {
        type = 'number'
        stringValue = String(value)
      } else if (typeof value === 'object') {
        type = 'json'
        stringValue = JSON.stringify(value)
      }
      
      updates.push({
        key,
        value: stringValue,
        type,
        updated_at: new Date().toISOString()
      })
    }

    // Update settings in database
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(updates, { onConflict: 'key' })

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 