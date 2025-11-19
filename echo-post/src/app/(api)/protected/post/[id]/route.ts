import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getUserIdFromToken(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) throw new Error("No token provided");

  const token = auth.split(" ")[1];
  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

// GET post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id, name, username } },
        comments: true,
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// PUT / update post by ID (only owner)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getUserIdFromToken(req);

    const body = await req.json();
    const { title, content, coverImage, status } = body;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, coverImage, status },
    });

    return NextResponse.json(updatedPost);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// DELETE post by ID (only owner)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const userId = await getUserIdFromToken(req);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



