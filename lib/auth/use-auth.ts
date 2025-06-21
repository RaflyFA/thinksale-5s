"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (provider?: string) => {
    try {
      await signIn(provider || "google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const requireAuth = (redirectTo: string = "/login") => {
    if (status === "loading") return null
    if (!session) {
      router.push(redirectTo)
      return null
    }
    return session
  }

  return {
    user: session?.user,
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    login,
    logout,
    requireAuth,
  }
} 