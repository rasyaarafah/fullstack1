import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get('user_role')?.value;

  // 1. If visiting root '/'
  if (pathname === '/') {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const redirectUrl = userRole === 'ADMIN' ? '/admin' : '/teacher';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 2. Protect Admin Routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/teacher', request.url));
    }
  }

  // 3. Protect Teacher Routes (/teacher/*)
  if (pathname.startsWith('/teacher')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole !== 'TEACHER') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 4. Prevent logged-in users from visiting /login again
  if (pathname === '/login' && userRole) {
    const redirectUrl = userRole === 'ADMIN' ? '/admin' : '/teacher';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/teacher/:path*', '/login'],
};