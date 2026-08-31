import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { noticeId, username } = await req.json();

    if (!noticeId || !username) {
      return NextResponse.json(
        { error: "noticeId and username are required." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).replace(/^@/, "").trim().toLowerCase();

    await prisma.noticeRead.upsert({
      where: {
        noticeId_username: {
          noticeId: String(noticeId),
          username: cleanUsername,
        },
      },
      update: {
        hasRead: true,
      },
      create: {
        noticeId: String(noticeId),
        username: cleanUsername,
        hasRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating notice read status:", err);
    return NextResponse.json(
      { error: "Failed to record acknowledgment" },
      { status: 500 }
    );
  }
}