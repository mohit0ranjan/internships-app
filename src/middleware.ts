import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/domains', '/openings', '/programme', '/faqs', '/login', '/admin/login', '/api/auth', '/screening', '/api/screening'];
const authRoutes = ['/login', '/admin/login'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = nextUrl.pathname;

  // Allow next/image, next/static, public assets
  if (pathname.startsWith('/_next/') || pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico|woff|woff2)$/)) {
    return NextResponse.next();
  }

  // Handle Verify routes explicitly
  if (pathname.startsWith('/verify') || pathname.startsWith('/api/verify')) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // If user is logged in and tries to access login/register, redirect based on role
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', nextUrl));
      }
      return NextResponse.redirect(new URL('/student', nextUrl));
    }
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Require authentication for all other routes
  if (!isLoggedIn) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/student', nextUrl));
  }

  if (pathname.startsWith('/student') && role !== 'APPLICANT') {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  // API Role-based access control
  if (pathname.startsWith('/api/admin') && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (pathname.startsWith('/api/student') && role !== 'APPLICANT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
