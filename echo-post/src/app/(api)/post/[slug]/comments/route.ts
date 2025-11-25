import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../../lib/auth";
import { checkRateLimit } from "../../../../../lib/rateLimiter";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        
        const post = await prisma.post.findUnique({ 
            where: isUUID ? { id: slug } : { slug: slug } 
        });
        
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comments = await prisma.comment.findMany({
            where: { postId: post.id, parentId: null },
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        username: true
                    }
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                                username: true
                            }
                        }
                    },
                    orderBy: { createdAt: "asc" }
                }
            },
        });
        return NextResponse.json({ comments });
    } catch (err) {
        console.error("Error fetching comments:", err);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
        const rl = checkRateLimit(ip);
        if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

        const decoded = verifyTokenFromReq(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content, parentId } = await req.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
        }

        const { slug } = await params;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        
        const post = await prisma.post.findUnique({ 
            where: isUUID ? { id: slug } : { slug: slug } 
        });
        
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId: post.id,
                authorId: decoded.id,
                parentId: parentId || null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        username: true
                    }
                }
            },
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (err) {
        console.error("Error creating comment:", err);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}