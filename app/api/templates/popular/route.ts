import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns templates sorted by usage (how many letters were created
// with a matching title), most-used first. Since Letter has no
// templateId column, usage is inferred by matching Letter.title
// against Template.title (case-insensitive).
export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    const [templates, usage] = await Promise.all([
      prisma.template.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.letter.groupBy({
        by: ["title"],
        _count: { title: true },
      }),
    ]);

    const usageByTitle = new Map<string, number>();
    usage.forEach((row) => {
      usageByTitle.set(row.title.trim().toLowerCase(), row._count.title);
    });

    const ranked = templates
      .map((tpl) => ({
        ...tpl,
        usageCount: usageByTitle.get(tpl.title.trim().toLowerCase()) || 0,
      }))
      .sort((a, b) => {
        if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
        // tie-break: newer templates first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, limit);

    return NextResponse.json(ranked);
  } catch (error: any) {
    console.error("GET /api/templates/popular error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch popular templates" },
      { status: 500 }
    );
  }
}