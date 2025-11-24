import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const following = await prisma.follow.findMany({
      where: { followerId: id },
      include: { following: { select: { id: true, name: true, username: true, avatarUrl: true } } },
    });
    return NextResponse.json({ following: following.map((f) => f.following) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}
