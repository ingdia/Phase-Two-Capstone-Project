// app/api/users/[id]/follow/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { requireAuthenticated } from "../../../../../lib/auth";
import { checkRateLimit } from "../../../../../lib/rateLimiter";

export async function POST(req: Request, { params }: any) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = requireAuthenticated(req);
    const targetId = params.id;
    if (user.id === targetId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: user.id, followingId: targetId } },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ following: false });
    }

    await prisma.follow.create({ data: { followerId: user.id, followingId: targetId } });
    return NextResponse.json({ following: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to follow/unfollow" }, { status: 500 });
  }
}
