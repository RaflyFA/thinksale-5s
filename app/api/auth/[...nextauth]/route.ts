import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from 'next-auth'
import { supabaseAdmin } from "@/lib/supabase/server"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { name, email, image } = user;

        if (!email) {
          console.error("Email not found in Google profile");
          return false;
        }

        try {
          const { data: existingUser, error: selectError } = await supabaseAdmin
            .from('users')
            .select('id, name, image')
            .eq('email', email)
            .single();

          if (selectError && selectError.code !== 'PGRST116') { // 'PGRST116' is "No rows found"
            console.error('Error fetching user:', selectError);
            return false;
          }

          if (!existingUser) {
            // User does not exist, create a new one
            const { error: insertError } = await supabaseAdmin
              .from('users')
              .insert({ name, email, image, role: 'user' });

            if (insertError) {
              console.error('Error creating user:', insertError);
              return false;
            }
          } else {
            // User exists, update if name or image has changed
            if (existingUser.name !== name || existingUser.image !== image) {
              const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({ name, image, updatedAt: new Date() })
                .eq('email', email);
              
              if (updateError) {
                console.error('Error updating user:', updateError);
                // Non-blocking error, just log it
              }
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Fetch user from DB to add custom properties to the token
      const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('id, role')
        .eq('email', token.email)
        .single();
      
      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
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