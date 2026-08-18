import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single letter details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Letter ID is required" },
        { status: 400 }
      );
    }

    const letter = await prisma.letter.findUnique({
      where: { id },
    });

    if (!letter) {
      return NextResponse.json(
        { error: "Letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Error fetching letter details:", error);
    return NextResponse.json(
      { error: "Failed to fetch letter details" },
      { status: 500 }
    );
  }
}

// PATCH update letter status (APPROVE / REJECT)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Letter ID is required" },
        { status: 400 }
      );
    }

    const updatedLetter = await prisma.letter.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        ...(rejectionReason && { rejectionReason }),
      },
    });

    return NextResponse.json(updatedLetter);
  } catch (error) {
    console.error("Error updating letter status:", error);
    return NextResponse.json(
      { error: "Failed to update letter status" },
      { status: 500 }
    );
  }
}