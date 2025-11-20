import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../../lib/auth";
import { checkRateLimit } from "../../../../../lib/rateLimiter";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
    try {
        const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
        const rl = checkRateLimit(ip);
        if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

        const decoded = verifyTokenFromReq(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const postId = params.postId;

        // Verify post exists
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Check existing like using compound unique constraint
        const existing = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: decoded.id,
                    postId: postId
                }
            }
        });

        if (existing) {
            // Unlike - remove the like
            await prisma.like.delete({ where: { id: existing.id } });
            return NextResponse.json({ liked: false });
        }

        // Like - create new like (users CAN like their own posts)
        await prisma.like.create({
            data: {
                userId: decoded.id,
                postId
            }
        });

        return NextResponse.json({ liked: true });
    } catch (err) {
        console.error("Error in like route:", err);
        return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
    }
}

