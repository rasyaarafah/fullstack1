import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KOP_SURAT_DEFAULTS } from "@/lib/kopSuratDefault";

function extractPlaceholders(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  const keys = matches.map((m) => m.replace(/[{}]/g, "").trim());
  return Array.from(new Set(keys));
}

async function getParamId(params: any): Promise<string> {
  const resolved = await params;
  return resolved?.id || "";
}

// GET single template details
export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const id = await getParamId(params);

    if (!id) {
      return NextResponse.json({ error: "Missing template id" }, { status: 400 });
    }

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error: any) {
    console.error("GET Template Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch template" }, { status: 500 });
  }
}

// UPDATE a template
export async function PUT(
  req: Request,
  { params }: { params: any }
) {
  try {
    const id = await getParamId(params);
    const body = await req.json();
    const { title, category, description, bodyContent, signerName, signerRole } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing template id" }, { status: 400 });
    }

    const target = await prisma.template.findUnique({
      where: { id },
    });

    if (!target) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const finalBodyContent = bodyContent || target.bodyContent || "";

    // Keep description safely trimmed to 180 chars to avoid VARCHAR(191) crashes
    const safeDescription = (description || target.description || title || target.title || "").slice(0, 180);

    // Save snapshot version safely.
    // IMPORTANT: this snapshot represents the template's state *right before*
    // this edit is applied, so every field here must come from `target`
    // (the pre-edit row) — never from the incoming `body` — or the saved
    // version ends up with a mismatched mix of old and new values.
    try {
      await prisma.templateVersion.create({
        data: {
          templateId: target.id,
          title: target.title || "Untitled",
          category: target.category || "Surat Keterangan",
          description: (target.description || target.title || "").slice(0, 180),
          placeholders: target.placeholders || "[]",
          bodyContent: target.bodyContent || "",
          signerName: target.signerName || KOP_SURAT_DEFAULTS.defaultSignerName,
          signerRole: target.signerRole || KOP_SURAT_DEFAULTS.defaultSignerRole,
        },
      });
    } catch (vErr) {
      console.warn("Version history warning:", vErr);
    }

    // Update main template record
    const updatedTemplate = await prisma.template.update({
      where: { id: target.id },
      data: {
        title: title ?? target.title,
        category: category ?? target.category,
        description: safeDescription,
        bodyContent: finalBodyContent,
        placeholders: JSON.stringify(extractPlaceholders(finalBodyContent)),
        signerName: signerName ?? target.signerName ?? KOP_SURAT_DEFAULTS.defaultSignerName,
        signerRole: signerRole ?? target.signerRole ?? KOP_SURAT_DEFAULTS.defaultSignerRole,
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error: any) {
    console.error("PUT Template Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE a template
export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const id = await getParamId(params);

    if (!id) {
      return NextResponse.json({ error: "Missing template id" }, { status: 400 });
    }

    const result = await prisma.template.deleteMany({
      where: { id },
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