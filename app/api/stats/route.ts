import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust based on your Prisma import path

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Fetch counts from Prisma in parallel
    const [pendingCount, approvedCount, myLettersCount] = await Promise.all([
      prisma.letter.count({
        where: { status: "PENDING" },
      }),
      prisma.letter.count({
        where: { status: "APPROVED" },
      }),
      email
        ? prisma.letter.count({
            where: {
              author: { email: email },
            },
          })
        : 0,
    ]);

    return NextResponse.json({
      pendingCount,
      approvedCount,
      myLettersCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}