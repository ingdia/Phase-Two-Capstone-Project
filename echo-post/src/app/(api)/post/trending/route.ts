import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const limit = Math.min(Number(url.searchParams.get("limit") || "4"), 20);

        // Get trending posts - most liked in recent time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const allPosts = await prisma.post.findMany({
            where: {
                status: "PUBLISHED",
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            take: 50, // Fetch more to ensure we get top posts
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Sort by like count and take top N
        const posts = allPosts
            .sort((a: typeof allPosts[0], b: typeof allPosts[0]) => {
                const aLikes = a._count?.likes || 0;
                const bLikes = b._count?.likes || 0;
                return bLikes - aLikes;
            })
            .slice(0, limit);

        return NextResponse.json({ posts });
    } catch (err) {
        console.error("Error fetching trending posts:", err);
        return NextResponse.json(
            { error: "Failed to fetch trending posts" },
            { status: 500 }
        );
    }
}

