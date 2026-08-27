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
      select: { id: true, name: true, email: true, role: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/me error:', error);
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
    const { name, email, image } = body;

    // Validate email uniqueness if user changes email
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

    // Perform DB update
    const updatedUser = await prisma.user.update({
      where: { email: currentUserEmail },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(image !== undefined && { image }),
      },
      select: { id: true, name: true, email: true, role: true, image: true },
    });

    const response = NextResponse.json(updatedUser);

    // Safely update response cookie if email was changed
    if (email && email !== currentUserEmail) {
      response.cookies.set('user_email', email, { path: '/' });
    }

    return response;
  } catch (error: any) {
    // Log actual server error to VS Code terminal for easier debugging
    console.error('PATCH /api/me error details:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}