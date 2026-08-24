// app/api/letters/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Handle GET requests (Fetch letters, supporting single or comma-separated statuses)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');

    let whereClause = {};

    if (statusFilter) {
      // Splits "PENDING,REJECTED,REVISE" into ["PENDING", "REJECTED", "REVISE"]
      const statuses = statusFilter.split(',').map((s) => s.trim().toUpperCase());
      whereClause = {
        status: { in: statuses },
      };
    }

    const letters = await prisma.letter.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
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

    if (userEmail) {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (dbUser)
         { 
          authorId = dbUser.id;
         }
    }

    if (!authorId) {
  const defaultUser = await prisma.user.findFirst({
    where: createdByRole === "TEACHER" ? { role: "TEACHER" } : {},
  });
  
  if (!defaultUser) {
    return NextResponse.json(
      { error: "No valid author user found to assign this letter to." },
      { status: 400 }
    );
  }
  authorId = defaultUser.id;
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