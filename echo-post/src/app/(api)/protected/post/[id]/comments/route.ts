import prisma from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request, { params }: any) {
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "Empty comment" }, { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.id,
        authorId: decoded.id,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to comment" }, { status: 500 });
  }
}
