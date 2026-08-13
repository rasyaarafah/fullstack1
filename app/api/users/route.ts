import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// 2. POST: Add a new user
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || 'TEACHER',
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// 3. PATCH: Update user role
export async function PATCH(req: Request) {
  try {
    const { id, role } = await req.json();

    if (!id || !role) {
      return NextResponse.json(
        { error: 'User ID and new role are required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    console.log("Updated user in DB:", updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}

// 4. DELETE: Delete user by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}