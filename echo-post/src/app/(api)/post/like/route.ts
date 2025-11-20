import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { requireAuthenticated } from "../../../../lib/auth";
import { checkRateLimit } from "../../../../lib/rateLimiter";

export async function POST(req: Request, { params }: any) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = requireAuthenticated(req);
    const postId = params.postId;

    // Check existing
    const existing = await prisma.like.findUnique({ where: { userId_postId: { userId: user.id, postId } } });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({ data: { userId: user.id, postId } });
    return NextResponse.json({ liked: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}
