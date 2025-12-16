import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');

    // Allow access to admin routes only for authenticated admin users
    if (isAdminRoute || isApiAdminRoute) {
      if (!token) {
        // Not authenticated
        const url = new URL('/auth/signin', req.url);
        url.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
      
      if (!token.isAdmin) {
        // Authenticated but not admin
        const url = new URL('/auth/error', req.url);
        url.searchParams.set('error', 'AccessDenied');
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow requests to proceed if they're not admin routes
        if (!req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/api/admin')) {
          return true;
        }
        // For admin routes, require a token (will be checked in middleware function above)
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
