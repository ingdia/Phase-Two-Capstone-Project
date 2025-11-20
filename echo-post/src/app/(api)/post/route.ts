// app/api/posts/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { requireAuthenticated } from "../../../lib/auth";
import { makeSlug } from "../../../lib/validators";
import { checkRateLimit } from "../../../lib/rateLimiter";

type QueryParams = {
  search?: string;
  page?: string;
  limit?: string;
  author?: string;
  tag?: string;
  status?: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams;
    const search = q.get("q") || q.get("search") || undefined;
    const page = Number(q.get("page") || "1");
    const limit = Math.min(Number(q.get("limit") || "10"), 100);
    const tag = q.get("tag") || undefined;
    const author = q.get("author") || undefined;
    const status = q.get("status") || "PUBLISHED"; // only published by default
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    if (author) where.authorId = author;
    if (tag) {
      where.tags = {
        some: {
          tag: { slug: tag },
        },
      };
    }

    const total = await prisma.post.count({ where });
    const items = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { id: true, name: true, username: true, avatarUrl: true } },
        _count: { select: { comments: true, likes: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({
      items: items.map((p) => ({
        ...p,
        tags: p.tags.map((pt) => pt.tag),
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // rate limit by ip
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = requireAuthenticated(req); // throws NextResponse if unauthorized
    const body = await req.json();
    const { title, content, coverImage, tagSlugs, status } = body;

    if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const slug = makeSlug(title);

    // create or connect tags
    const connectTags =
      Array.isArray(tagSlugs) && tagSlugs.length > 0
        ? {
            create: await Promise.all(
              tagSlugs.map(async (slug: string) => {
                const tag = await prisma.tag.upsert({
                  where: { slug },
                  update: {},
                  create: { name: slug.replace(/-/g, " "), slug },
                });
                // create PostTag relation data
                return { tag: { connect: { id: tag.id } } };
              })
            ),
          }
        : undefined;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImage,
        slug,
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        authorId: user.id,
        // tags: connectTags, // Prisma nested create via join table: use createMany style below instead
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
    });

    // attach tags separately to avoid complex nested creation
    if (Array.isArray(tagSlugs) && tagSlugs.length > 0) {
      for (const slugTag of tagSlugs) {
        const tag = await prisma.tag.upsert({
          where: { slug: slugTag },
          update: {},
          create: { name: slugTag.replace(/-/g, " "), slug: slugTag },
        });
        await prisma.postTag.create({
          data: { postId: post.id, tagId: tag.id },
        });
      }
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
