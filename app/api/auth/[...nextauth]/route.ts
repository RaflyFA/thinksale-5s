import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      try {
        const { data: existingUser, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          // Update user if they exist
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
              name: user.name,
              image: user.image,
            })
            .eq('email', user.email);
          
          if (updateError) {
            console.error('Error updating user:', updateError);
            return false;
          }
          // Attach role and id to the user object for session
          user.role = existingUser.role;
          user.id = existingUser.id;
        } else {
          // Create new user if they don't exist
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert({
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'user', // Default role
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }

          if (newUser) {
            user.role = newUser.role;
            user.id = newUser.id;
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn Error:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 