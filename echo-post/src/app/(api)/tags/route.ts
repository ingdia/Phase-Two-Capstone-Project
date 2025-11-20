import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ tags });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const created = await prisma.tag.create({
      data: { name, slug: slug ?? name.toLowerCase().replace(/\s+/g, "-") },
    });
    return NextResponse.json({ tag: created }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Tag already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed creating tag" }, { status: 500 });
  }
}
