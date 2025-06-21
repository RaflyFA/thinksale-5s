import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` akan memperkaya `req.nextauth.token` dengan token Anda
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Jika user bukan admin dan mencoba mengakses rute admin, alihkan ke halaman utama
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Memastikan user sudah login
    },
  }
)

// Terapkan middleware ini ke semua rute di bawah /admin
export const config = { matcher: ["/admin/:path*"] } 