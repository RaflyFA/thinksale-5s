import { supabaseAdmin } from '@/lib/supabase/admin'

export interface AppSettings {
  general: {
    store_name: string
    store_description: string
    contact_email: string
    contact_phone: string
    store_logo: string
    hero_image?: string
  }
  notification: {
    email_notifications: boolean
    order_notifications: boolean
    user_notifications: boolean
    system_notifications: boolean
  }
  system: {
    app_version: string
    database_type: string
    framework: string
    authentication: string
  }
}

// Cache for settings to avoid repeated database calls
let settingsCache: AppSettings | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getSettings(): Promise<AppSettings> {
  // Check if cache is still valid
  const now = Date.now()
  if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache
  }

  try {
    const { data: settings, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true })

    if (error) {
      console.error('Error fetching settings:', error)
      return getDefaultSettings()
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

    // Update cache
    settingsCache = groupedSettings as AppSettings
    cacheTimestamp = now

    return groupedSettings as AppSettings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return getDefaultSettings()
  }
}

export function getDefaultSettings(): AppSettings {
  return {
    general: {
      store_name: "ThinkSale",
      store_description: "Toko laptop terpercaya dengan kualitas terbaik",
      contact_email: "admin@thinksale.com",
      contact_phone: "+62 812-3456-7890",
      store_logo: "",
      hero_image: "/lenovo hitam 1.png"
    },
    notification: {
      email_notifications: true,
      order_notifications: true,
      user_notifications: false,
      system_notifications: true
    },
    system: {
      app_version: "1.0.0",
      database_type: "Supabase",
      framework: "Next.js 14",
      authentication: "NextAuth.js"
    }
  }
}

// Clear cache (useful for testing or when settings are updated)
export function clearSettingsCache() {
  settingsCache = null
  cacheTimestamp = 0
} 