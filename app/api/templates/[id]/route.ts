import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single template details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const template = await prisma.template.findFirst({
      where: {
        OR: [{ id }, { title: id }, { category: id }],
      },
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

    // Resolve target template first if ID is passed as a category string
    const target = await prisma.template.findFirst({
      where: { OR: [{ id }, { title: id }, { category: id }] },
    });

    if (!target) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: target.id },
      data: {
        title,
        category,
        description,
        placeholders:
          typeof placeholders === "string"
            ? placeholders
            : JSON.stringify(placeholders || []),
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

    // Delete matching records whether passed a database ID or category/title identifier
    const result = await prisma.template.deleteMany({
      where: {
        OR: [
          { id },
          { category: { equals: id } },
          { title: { equals: id } },
        ],
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "No matching template found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Template Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete template" },
      { status: 500 }
    );
  }
}