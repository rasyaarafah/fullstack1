// File: src/app/api/notice/stop/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Deactivate all currently active notices
    await prisma.notice.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    return NextResponse.json(
      { success: true, message: "Notice stopped successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/notice/stop error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to stop active notice" },
      { status: 500 }
    );
  }
}