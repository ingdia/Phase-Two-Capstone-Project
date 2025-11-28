import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const limit = Math.min(Number(url.searchParams.get("limit") || "3"), 10);

        const users = await prisma.user.findMany({
            take: 50, // Fetch more than needed to ensure we get top users
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        posts: true,
                    },
                },
            },
        });

        // Sort by follower count and take top N
        const sortedUsers = users
            .sort((a: typeof users[0], b: typeof users[0]) => {
                return b._count.followers - a._count.followers;
            })
            .slice(0, limit);

        // Format the response to match Author type
        const authors = sortedUsers.map((user: typeof sortedUsers[0]) => ({
            id: user.id,
            name: user.name || user.username || "Anonymous",
            avatar: user.avatarUrl || "/image/image.png",
            followers: `${user._count.followers} ${user._count.followers === 1 ? "follower" : "followers"}`,
            username: user.username,
            bio: user.bio,
        }));

        return NextResponse.json({ authors });
    } catch (err) {
        console.error("Error fetching trending authors:", err);
        return NextResponse.json(
            { error: "Failed to fetch trending authors" },
            { status: 500 }
        );
    }
}

