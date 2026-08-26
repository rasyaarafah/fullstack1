// app/api/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active session' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const currentUserEmail = cookieStore.get('user_email')?.value;

    if (!currentUserEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    // Optional check: Ensure the new email isn't already taken by another user
    if (email && email !== currentUserEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: currentUserEmail },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // Sync session cookie if email was modified
    if (email && email !== currentUserEmail) {
      cookieStore.set('user_email', email, { path: '/' });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PATCH /api/me error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}