import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../../lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Try to get user ID from token (optional - for checking like status)
    const decoded = verifyTokenFromReq(req);
    const userId = decoded?.id;

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        tags: { include: { tag: true } },
        likes: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Calculate read time (average reading speed: 200 words per minute)
    const words = post.content.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);

    // Check if current user has liked this post
    const userLiked = userId ? post.likes.some((like) => like.userId === userId) : false;

    return NextResponse.json({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
      likeCount: post.likes.length,
      readTime: `${readTime} min read`,
      userLiked, // Add this field for easier frontend checking
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
