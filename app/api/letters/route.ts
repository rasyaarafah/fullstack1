// app/api/letters/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Handle GET requests
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');

    let whereClause = {};

    if (statusFilter) {
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
  } catch (error: any) {
    console.error('Error fetching letters:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengambil data surat' },
      { status: 500 }
    );
  }
}

// 2. Handle POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      letterNumber,
      recipient,
      subject,
      body: letterBody,
      status,
      createdByRole,
      userEmail,
      leftLogo,
      rightLogo,
      templateId,
    } = body;

    // Validate essential fields
    if (!title || !recipient || !letterBody) {
      return NextResponse.json(
        { error: "Title, recipient, and body are required." },
        { status: 400 }
      );
    }

    let authorId: number | null = null;
    let userRole = createdByRole ? createdByRole.toUpperCase() : null;

    // 1. Resolve user by provided userEmail
    if (userEmail) {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (dbUser) { 
        authorId = dbUser.id;
        if (!userRole && dbUser.role) {
          userRole = dbUser.role.toUpperCase();
        }
      }
    }

    // 2. Fallback to default user if no user was resolved
    if (!authorId) {
      const defaultUser = await prisma.user.findFirst({
        where: userRole === "TEACHER" ? { role: "TEACHER" } : {},
      });

      if (defaultUser) {
        authorId = defaultUser.id;
        if (!userRole && defaultUser.role) {
          userRole = defaultUser.role.toUpperCase();
        }
      } else {
        // Fallback to absolute first user in DB if target role is missing
        const fallbackAnyUser = await prisma.user.findFirst();
        if (!fallbackAnyUser) {
          return NextResponse.json(
            { error: "No valid user found in database to assign as author." },
            { status: 400 }
          );
        }
        authorId = fallbackAnyUser.id;
      }
    }

    // 3. Normalize Status to match Prisma Enums (APPROVED, PENDING, REJECTED, REVISE)
    let finalStatus = "PENDING";
    const requestedStatus = status ? status.toUpperCase() : "";

    if (userRole === "ADMIN" || requestedStatus === "APPROVED") {
      finalStatus = "APPROVED";
    } else if (["PENDING", "REJECTED", "REVISE"].includes(requestedStatus)) {
      finalStatus = requestedStatus;
    }

    // 4. Resolve templateId defensively — the new-letter page may send an id
    // from its offline FALLBACK_TEMPLATES list (e.g. "1", "2") or "custom"
    // when the templates API was unreachable. Those aren't real Template
    // rows, so silently drop them instead of letting the foreign key fail.
    let resolvedTemplateId: string | null = null;
    if (templateId && templateId !== "custom") {
      const matchingTemplate = await prisma.template.findUnique({
        where: { id: templateId },
        select: { id: true },
      });
      if (matchingTemplate) {
        resolvedTemplateId = matchingTemplate.id;
      }
    }

    // 5. Create record in Prisma database
    const newLetter = await prisma.letter.create({
      data: {
        title,
        letterNumber: letterNumber || null,
        recipient,
        subject: subject || title,
        body: letterBody,
        status: finalStatus as any, // Cast to match Prisma Enum
        leftLogo: leftLogo || null,
        rightLogo: rightLogo || null,
        templateId: resolvedTemplateId,
        authorId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error: any) {
    console.error("Error creating letter in /api/letters:", error);
    
    // Return explicit error message to aid frontend debugging
    return NextResponse.json(
      { 
        error: error?.message || "Gagal membuat surat",
        details: error?.code || null 
      },
      { status: 500 }
    );
  }
}