import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../lib/auth";

export async function GET(req: Request) {
    try {
        const decoded = verifyTokenFromReq(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                        likes: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get published and draft posts counts separately
        const [publishedCount, draftCount] = await Promise.all([
            prisma.post.count({ where: { authorId: decoded.id, status: "PUBLISHED" } }),
            prisma.post.count({ where: { authorId: decoded.id, status: "DRAFT" } }),
        ]).catch(() => [0, 0]);

        const { _count, ...userWithoutCount } = user;
        const profile = {
            ...userWithoutCount,
            stats: {
                published: publishedCount,
                drafts: draftCount,
                followers: _count.followers,
                following: _count.following,
                likes: _count.likes,
            },
        };

        return NextResponse.json({ user: profile }, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching profile:", err);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
