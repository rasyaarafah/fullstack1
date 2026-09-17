import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all saved versions for a template, most recent first
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const versions = await prisma.templateVersion.findMany({
      where: { templateId: id },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("GET Template Versions Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch template versions" },
      { status: 500 }
    );
  }
}

// POST { versionId } to restore a template back to a previous snapshot.
// The current state is snapshotted first, so restoring is also reversible.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { versionId } = await req.json();

    if (!versionId) {
      return NextResponse.json(
        { error: "versionId is required" },
        { status: 400 }
      );
    }

    const version = await prisma.templateVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.templateId !== id) {
      return NextResponse.json(
        { error: "Version not found for this template" },
        { status: 404 }
      );
    }

    const current = await prisma.template.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Snapshot the current state before restoring, so this can be undone too.
    await prisma.templateVersion.create({
      data: {
        templateId: current.id,
        title: current.title,
        category: current.category,
        description: current.description,
        placeholders: current.placeholders,
        bodyContent: current.bodyContent,
      },
    });

    const restored = await prisma.template.update({
      where: { id },
      data: {
        title: version.title,
        category: version.category,
        description: version.description,
        placeholders: version.placeholders,
        bodyContent: version.bodyContent,
      },
    });

    return NextResponse.json(restored);
  } catch (error) {
    console.error("POST Restore Template Version Error:", error);
    return NextResponse.json(
      { error: "Failed to restore template version" },
      { status: 500 }
    );
  }
}