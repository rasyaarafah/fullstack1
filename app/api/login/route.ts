import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Find user by email in MySQL via Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Create response object
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // 4. Set cookies on response object
    const isProd = process.env.NODE_ENV === 'production';

    response.cookies.set('user_role', user.role, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: isProd,
    });

    response.cookies.set('user_email', user.email, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: isProd,
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}