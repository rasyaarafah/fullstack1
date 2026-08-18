import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/letters - Fetch letters with flexible filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereCondition: any = {};
    if (status) {
      // Support comma-separated statuses e.g. status=PENDING,REJECTED
      const statuses = status.split(",").map((s) => s.trim().toUpperCase());
      whereCondition.status = statuses.length > 1 ? { in: statuses } : statuses[0];
    }

    const letters = await prisma.letter.findMany({
      where: whereCondition,
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(letters);
  } catch (error) {
    console.error("Error fetching letters:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data surat" },
      { status: 500 }
    );
  }
}

// POST /api/letters - Save a new letter (APPROVED for Admin, PENDING/DRAFT for Teacher)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, letterNumber, recipient, subject, body: letterBody, status, createdByRole } = body;

    if (!title || !recipient || !letterBody) {
      return NextResponse.json(
        { error: "Title, recipient, and body are required." },
        { status: 400 }
      );
    }

    const firstUser = await prisma.user.findFirst();
    const authorId = firstUser?.id || 1;

    // Admin letters auto-approve directly into history/archive
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