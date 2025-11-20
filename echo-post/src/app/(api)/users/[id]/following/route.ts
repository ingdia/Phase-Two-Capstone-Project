import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request, { params }: any) {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: params.id },
      include: { following: { select: { id: true, name: true, username: true, avatarUrl: true } } },
    });
    return NextResponse.json({ following: following.map((f) => f.following) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}
