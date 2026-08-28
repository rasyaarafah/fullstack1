import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTemplate = await prisma.template.create({
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        placeholders: JSON.stringify(body.placeholders || []),
        bodyContent: body.bodyContent,
      },
    });
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}