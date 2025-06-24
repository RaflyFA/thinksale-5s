import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export interface SessionUser {
  id: string
  name: string
  email: string
  role: string
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return null
    }

    return {
      id: session.user.id,
      name: session.user.name || '',
      email: session.user.email || '',
      role: session.user.role || 'user'
    }
  } catch (error) {
    console.error('Error getting session user:', error)
    return null
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('Unauthorized: User not authenticated')
  }
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === 'admin'
} 