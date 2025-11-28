import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const limit = Math.min(Number(url.searchParams.get("limit") || "2"), 10);

        
        const allPosts = await prisma.post.findMany({
            where: {
                status: "PUBLISHED",
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
                tags: {
                    include: {
                        tag: true,
                    },
                },
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

        // Calculate read time for each post
        const postsWithReadTime = posts.map((post: typeof posts[0]) => {
            const words = post.content.split(/\s+/).length;
            const readTime = Math.ceil(words / 200);
            return {
                ...post,
                tags: post.tags.map((pt: typeof post.tags[0]) => pt.tag),
                readTime: `${readTime} min read`,
            };
        });

        return NextResponse.json({ posts: postsWithReadTime });
    } catch (err) {
        console.error("Error fetching featured posts:", err);
        return NextResponse.json(
            { error: "Failed to fetch featured posts" },
            { status: 500 }
        );
    }
}

