import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../../lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log("Slug route called with slug:", slug);

    if (!slug) {
      console.log("No slug provided");
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    console.log("Looking for post with slug:", slug);

    // Optional: retrieve user from token
    const decoded = verifyTokenFromReq(req);
    const userId = decoded?.id;
    console.log("User ID from token:", userId);

    const post = await prisma.post.findUnique({
      where: { slug },
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
      console.log("Post not found in database for slug:", slug);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("Post found:", { id: post.id, title: post.title, slug: post.slug });

    // Calculate read time (200 words/minute)
    const words = post.content?.split(/\s+/).length ?? 0;
    const readTime = Math.ceil(words / 200);

    // Has user liked?
    const userLiked = userId
      ? post.likes.some((like: { userId: string }) => like.userId === userId)
      : false;

    return NextResponse.json({
      ...post,
      tags: post.tags.map((pt: any) => pt.tag),
      likeCount: post.likes.length,
      readTime: `${readTime} min read`,
      userLiked,
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
