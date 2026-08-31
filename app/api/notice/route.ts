import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        noticeReads: true,
      },
    });

    // Map `noticeReads` to `readStatus` to match client component expectations
    const formattedNotices = notices.map((notice: any) => ({
      ...notice,
      readStatus: notice.noticeReads,
    }));

    return NextResponse.json({ history: formattedNotices });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const audience = String(
      body.targetAudience || body.audienceType || "all"
    ).trim().toLowerCase();

    if (!message) {
      return NextResponse.json(
        { error: "Announcement message cannot be empty." },
        { status: 400 }
      );
    }

    // Deactivate previous active notices
    await prisma.notice.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    }).catch(() => null);

    // Normalize recipient list
    let rawTargets: string[] = [];
    if (Array.isArray(body.targetUsers)) {
      rawTargets = body.targetUsers.map((u: any) => String(u).trim());
    } else if (body.targetUsers) {
      rawTargets = [String(body.targetUsers).trim()];
    }

    // Encode recipients inside targetAudience to bypass missing schema columns
    let storedAudience = audience;
    if (audience === "custom" || audience === "specific" || audience === "users") {
      storedAudience = `custom:${JSON.stringify(rawTargets)}`;
    }

    let createdNotice = null;
    try {
      createdNotice = await prisma.notice.create({
        data: {
          message,
          targetAudience: storedAudience,
          isActive: true,
        },
      });
    } catch {
      createdNotice = await prisma.notice.create({
        data: {
          message,
          audienceType: storedAudience,
          isActive: true,
        } as any,
      });
    }

    return NextResponse.json(createdNotice, { status: 201 });
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error("POST /api/notice failed:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}