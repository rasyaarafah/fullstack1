import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KOP_SURAT_DEFAULTS } from "@/lib/kopSuratDefault";

// Single source of truth for placeholder detection — the client no longer
// sends `placeholders`, since it was always going out of sync with
// whatever was actually typed into bodyContent. We derive it here instead.
function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  const keys = matches.map((m) => m.replace(/[{}]/g, "").trim());
  return Array.from(new Set(keys));
}

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
    const { title, category, description, bodyContent, signerName, signerRole } = body;

    // Resolve target template first if ID is passed as a category string
    const target = await prisma.template.findFirst({
      where: { OR: [{ id }, { title: id }, { category: id }] },
    });

    if (!target) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Snapshot the current (pre-edit) state before overwriting it, so
    // previous versions are never lost.
    await prisma.templateVersion.create({
      data: {
        templateId: target.id,
        title: target.title,
        category: target.category,
        description: target.description,
        placeholders: target.placeholders,
        bodyContent: target.bodyContent,
        signerName: target.signerName,
        signerRole: target.signerRole,
      },
    });

    const finalBodyContent = bodyContent || description || target.bodyContent;

    const updatedTemplate = await prisma.template.update({
      where: { id: target.id },
      data: {
        title,
        category,
        description,
        bodyContent: finalBodyContent,
        // Always derived from the current bodyContent — never trusted
        // from the client, so this can no longer drift out of sync.
        placeholders: JSON.stringify(extractPlaceholders(finalBodyContent)),
        signerName: signerName || target.signerName || KOP_SURAT_DEFAULTS.defaultSignerName,
        signerRole: signerRole || target.signerRole || KOP_SURAT_DEFAULTS.defaultSignerRole,
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