import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // Create new user
            const { error } = await supabaseAdmin
              .from('users')
              .insert({
                name: user.name,
                email: user.email,
                image: user.image,
                role: 'user'
              })

            if (error) {
              console.error('Error creating user:', error)
              return false
            }
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        try {
          // Get user data from database
          const { data: dbUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (dbUser) {
            token.role = dbUser.role
            token.id = dbUser.id
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
} 