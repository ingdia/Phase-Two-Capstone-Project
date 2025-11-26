import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log("Post route called with slug:", slug);

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // Check if it's a UUID (postId) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    const decoded = verifyTokenFromReq(req);
    const userId = decoded?.id;

    const post = await prisma.post.findUnique({
      where: isUUID ? { id: slug } : { slug: slug },
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
      console.log("Post not found for slug:", slug);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("Post found:", { id: post.id, title: post.title, slug: post.slug });

    const words = post.content?.split(/\s+/).length ?? 0;
    const readTime = Math.ceil(words / 200);

    const userLiked = userId
      ? post.likes.some((like: { userId: string }) => like.userId === userId)
      : false;

    return NextResponse.json({
      ...post,
      tags: post.tags.map((pt: { tag: any }) => pt.tag),
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

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const decoded = verifyTokenFromReq(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    const post = await prisma.post.findUnique({ 
      where: isUUID ? { id: slug } : { slug: slug } 
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    if (post.authorId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, content, status, tags, tagSlugs, coverImage } = await req.json();
    const tagList = tags || tagSlugs || [];

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        title,
        content,
        status,
        coverImage,
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (Array.isArray(tagList)) {
      await prisma.postTag.deleteMany({ where: { postId: post.id } });
      for (const tagSlug of tagList) {
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagSlug.replace(/-/g, " "), slug: tagSlug },
        });
        await prisma.postTag.create({
          data: { postId: post.id, tagId: tag.id },
        });
      }
    }

    const finalPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: { select: { id: true, name: true, username: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return NextResponse.json({
      ...finalPost,
      tags: finalPost?.tags.map((pt: { tag: any }) => pt.tag) || [],
    });
  } catch (err) {
    console.error("Error updating post:", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const decoded = verifyTokenFromReq(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    const post = await prisma.post.findUnique({ 
      where: isUUID ? { id: slug } : { slug: slug } 
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    if (post.authorId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.postTag.deleteMany({ where: { postId: post.id } }),
      prisma.comment.deleteMany({ where: { postId: post.id } }),
      prisma.like.deleteMany({ where: { postId: post.id } }),
      prisma.post.delete({ where: { id: post.id } }),
    ]);

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("Error deleting post:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}