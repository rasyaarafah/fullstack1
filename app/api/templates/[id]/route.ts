import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single template details
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

// UPDATE a template
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, category, description, placeholders, bodyContent } = body;

    const updatedTemplate = await prisma.template.update({
      where: { id: params.id },
      data: {
        title,
        category,
        description,
        placeholders: JSON.stringify(placeholders || []),
        bodyContent,
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

// DELETE a template
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.template.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}