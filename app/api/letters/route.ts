// app/api/letters/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { KOP_SURAT_DEFAULTS } from '@/lib/kopSuratDefault';

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
      // Optional explicit override — if the admin ever wants to sign a
      // specific letter differently from its template's default signer.
      signerName: signerNameOverride,
      signerRole: signerRoleOverride,
    } = body;

    // Validate essential payload inputs
    if (!title || !recipient || !letterBody) {
      return NextResponse.json(
        { error: "Title, recipient, and body are required." },
        { status: 400 }
      );
    }

    let authorId: number | null = null;
    let userRole = createdByRole ? createdByRole.toUpperCase() : null;

    // 1. Resolve author user by provided userEmail
    if (userEmail) {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (dbUser) { 
        authorId = dbUser.id;
        if (!userRole && dbUser.role) {
          userRole = dbUser.role.toUpperCase();
        }
      }
    }

    // 2. Fallback to existing user in DB if author identification fails
    if (!authorId) {
      const defaultUser = await prisma.user.findFirst({
        where: userRole === "TEACHER" ? { role: "TEACHER" } : {},
      });

      if (defaultUser) {
        authorId = defaultUser.id;
      } else {
        const fallbackAnyUser = await prisma.user.findFirst();
        if (!fallbackAnyUser) {
          return NextResponse.json(
            { error: "No user account found in database to set as letter author." },
            { status: 400 }
          );
        }
        authorId = fallbackAnyUser.id;
      }
    }

    // 3. Resolve status enum safely
    let finalStatus = "PENDING";
    const requestedStatus = status ? status.toUpperCase() : "";

    if (userRole === "ADMIN" || requestedStatus === "APPROVED") {
      finalStatus = "APPROVED";
    } else if (["PENDING", "REJECTED"].includes(requestedStatus)) {
      finalStatus = requestedStatus;
    }

    // 4. Safely check for existing relational templateId, and pull its
    // signer along with it so the letter can snapshot who signs it.
    let resolvedTemplateId: string | undefined = undefined;
    let resolvedSignerName = signerNameOverride || KOP_SURAT_DEFAULTS.defaultSignerName;
    let resolvedSignerRole = signerRoleOverride || KOP_SURAT_DEFAULTS.defaultSignerRole;

    if (templateId && templateId !== "custom") {
      const matchingTemplate = await prisma.template.findUnique({
        where: { id: String(templateId) },
        select: { id: true, signerName: true, signerRole: true },
      });
      if (matchingTemplate) {
        resolvedTemplateId = matchingTemplate.id;
        if (!signerNameOverride && matchingTemplate.signerName) {
          resolvedSignerName = matchingTemplate.signerName;
        }
        if (!signerRoleOverride && matchingTemplate.signerRole) {
          resolvedSignerRole = matchingTemplate.signerRole;
        }
      }
    }

    // 5. Build clean data object for Prisma creation without undefined fields
    const letterDataToCreate: Record<string, any> = {
      title: String(title),
      letterNumber: letterNumber ? String(letterNumber) : null,
      recipient: String(recipient),
      subject: subject ? String(subject) : String(title),
      body: String(letterBody),
      status: finalStatus,
      authorId: authorId,
      // Snapshotted at creation time — won't change later even if the
      // template's signer is edited afterward.
      signerName: resolvedSignerName,
      signerRole: resolvedSignerRole,
    };

    if (leftLogo !== undefined && leftLogo !== null) {
      letterDataToCreate.leftLogo = String(leftLogo);
    }
    if (rightLogo !== undefined && rightLogo !== null) {
      letterDataToCreate.rightLogo = String(rightLogo);
    }
    if (resolvedTemplateId) {
      letterDataToCreate.templateId = resolvedTemplateId;
    }

    const newLetter = await prisma.letter.create({
      data: letterDataToCreate as any,
      include: {
        author: true,
      },
    });

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error: any) {
    console.error("Error creating letter in /api/letters:", error);
    
    return NextResponse.json(
      { 
        error: error?.message || "Gagal membuat surat",
        details: error?.meta || error?.code || null 
      },
      { status: 500 }
    );
  }
}