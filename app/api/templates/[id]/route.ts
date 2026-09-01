import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single template details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("GET Template Error:", error);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

// UPDATE a template
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, category, description, placeholders, bodyContent } = body;

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        title,
        category,
        description,
        placeholders: typeof placeholders === "string" ? placeholders : JSON.stringify(placeholders || []),
        bodyContent: bodyContent || description,
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("PUT Template Error:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

// DELETE a template
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("DELETE Template Error:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}