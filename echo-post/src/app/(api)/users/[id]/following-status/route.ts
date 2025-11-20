import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { verifyTokenFromReq } from "../../../../../lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const decoded = verifyTokenFromReq(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const targetId = params.id;

        // Check if user is trying to check their own following status
        if (decoded.id === targetId) {
            return NextResponse.json({ following: false, canFollow: false });
        }

        // Check if current user is following the target user
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: decoded.id,
                    followingId: targetId,
                },
            },
        });

        return NextResponse.json({
            following: !!follow,
            canFollow: true,
        });
    } catch (err) {
        console.error("Error checking following status:", err);
        return NextResponse.json({ error: "Failed to check following status" }, { status: 500 });
    }
}

