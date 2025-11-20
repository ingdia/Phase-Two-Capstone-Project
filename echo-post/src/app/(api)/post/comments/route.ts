// app/api/posts/[postId]/comments/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { requireAuthenticated } from "../../../../lib/auth";
import { checkRateLimit } from "../../../../lib/rateLimiter";

export async function GET(req: Request, { params }: any) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, avatarUrl: true, username: true } } },
    });
    return NextResponse.json({ comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: any) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = requireAuthenticated(req);
    const { content, parentId } = await req.json();
    if (!content || content.trim().length === 0) return NextResponse.json({ error: "Empty comment" }, { status: 400 });

    // Optional: validate post exists
    const post = await prisma.post.findUnique({ where: { id: params.postId } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.postId,
        authorId: user.id,
        // parentId // if you add parentId in schema (currently not, but you could)
      },
      include: { author: { select: { id: true, name: true, avatarUrl: true, username: true } } },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
