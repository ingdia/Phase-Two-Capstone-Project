import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: { follower: { select: { id: true, name: true, username: true, avatarUrl: true } } },
    });
    return NextResponse.json({ followers: followers.map((f) => f.follower) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}
