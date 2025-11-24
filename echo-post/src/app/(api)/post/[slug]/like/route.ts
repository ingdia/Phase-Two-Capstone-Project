import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../../lib/auth";
import { checkRateLimit } from "../../../../../lib/rateLimiter";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
        const rl = checkRateLimit(ip);
        if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

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

        const existing = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: decoded.id,
                    postId: post.id
                }
            }
        });

        if (existing) {
            await prisma.like.delete({ where: { id: existing.id } });
            return NextResponse.json({ liked: false });
        }

        await prisma.like.create({
            data: {
                userId: decoded.id,
                postId: post.id
            }
        });

        return NextResponse.json({ liked: true });
    } catch (err) {
        console.error("Error in like route:", err);
        return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
    }
}