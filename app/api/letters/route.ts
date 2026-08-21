import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Handle GET requests (Fetch letters, with optional status filtering)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');

    // Filter by status if provided in the URL query (?status=PENDING)
    const whereClause = statusFilter ? { status: statusFilter.toUpperCase() } : {};

    const letters = await prisma.letter.findMany({
      where: whereClause,
      include: {
        author: true, // Pulls in the user relation so you can see who made it
      },
    });
    
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error('Error fetching letters:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data surat' },
      { status: 500 }
    );
  }
}

// 2. Handle POST requests (Create a letter)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, letterNumber, recipient, subject, body: letterBody, status, createdByRole, userEmail } = body;

    if (!title || !recipient || !letterBody) {
      return NextResponse.json(
        { error: "Title, recipient, and body are required." },
        { status: 400 }
      );
    }

    let authorId: number | null = null;

    // 1. Try finding user by email sent from frontend payload
    if (userEmail) {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (dbUser) authorId = dbUser.id;
    }

    // 2. If not found, try getting user info from cookies or fallback gracefully
    if (!authorId) {
      const activeUser = await prisma.user.findFirst({
        where: { NOT: { name: { contains: "Ahmad" } } }
      });
      authorId = activeUser ? activeUser.id : 1;
    }

    const finalStatus = createdByRole === "ADMIN" 
      ? "APPROVED" 
      : status 
      ? status.toUpperCase() 
      : "PENDING";

    const newLetter = await prisma.letter.create({
      data: {
        title,
        letterNumber: letterNumber || null,
        recipient,
        subject: subject || null,
        body: letterBody,
        status: finalStatus,
        authorId,
      },
    });

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error) {
    console.error("Error creating letter:", error);
    return NextResponse.json(
      { error: "Gagal membuat surat" },
      { status: 500 }
    );
  }
}