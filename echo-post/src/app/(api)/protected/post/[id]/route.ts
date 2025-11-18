import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// GET a post by id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, comments: true },
  });

  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json(post);
}

// DELETE a post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  const deletedPost = await prisma.post.delete({ where: { id } });
  return NextResponse.json({ message: "Post deleted", deletedPost });
}

// UPDATE a post
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const body = await req.json();

  const updatedPost = await prisma.post.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updatedPost);
}
