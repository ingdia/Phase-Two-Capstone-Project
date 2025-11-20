import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { requireAuthenticated } from "../../../../lib/auth";
import { makeSlug } from "../../../../lib/validators";
import { checkRateLimit } from "../../../../lib/rateLimiter";

export async function GET(req: Request, { params }: any) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        author: { select: { id: true, name: true, username: true, avatarUrl: true } },
        comments: { include: { author: { select: { id: true, name: true, avatarUrl: true } } } },
        tags: { include: { tag: true } },
        likes: true,
      },
    });

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
      likeCount: post.likes.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: any) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = requireAuthenticated(req);

    const post = await prisma.post.findUnique({ where: { id: params.postId } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { title, content, coverImage, status, tagSlugs } = await req.json();

    const data: any = { updatedAt: new Date() };
    if (title) {
      data.title = title;
      data.slug = makeSlug(title);
    }
    if (content) data.content = content;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (status) data.status = status;

    const updated = await prisma.post.update({ where: { id: params.postId }, data });

    // handle tags: simple approach: remove existing postTags and re-create
    if (Array.isArray(tagSlugs)) {
      await prisma.postTag.deleteMany({ where: { postId: params.postId } });
      for (const slug of tagSlugs) {
        const tag = await prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name: slug.replace(/-/g, " "), slug },
        });
        await prisma.postTag.create({ data: { postId: params.postId, tagId: tag.id } });
      }
    }

    return NextResponse.json({ post: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = requireAuthenticated(req);

    const post = await prisma.post.findUnique({ where: { id: params.postId } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Soft delete pattern can be used. Here we hard-delete including postTags/comments/likes
    await prisma.$transaction([
      prisma.postTag.deleteMany({ where: { postId: params.postId } }),
      prisma.comment.deleteMany({ where: { postId: params.postId } }),
      prisma.like.deleteMany({ where: { postId: params.postId } }),
      prisma.post.delete({ where: { id: params.postId } }),
    ]);

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
