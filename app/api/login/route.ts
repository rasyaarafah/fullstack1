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

    // 3. Create the response object
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // 4. Hand out the wristband (Cookie) so Next.js remembers them!
    response.cookies.set('user_role', user.role, {
      httpOnly: true, // Security: Prevents malicious client scripts from tampering with it
      path: '/',      // Cookie works across the entire website
      maxAge: 60 * 60 * 24, // Expire in 1 day (in seconds)
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