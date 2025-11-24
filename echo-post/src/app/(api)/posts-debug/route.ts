import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            username: true
          }
        }
      },
      take: 10
    });

    return NextResponse.json({ 
      message: "Posts debug", 
      count: posts.length,
      posts: posts
    });
  } catch (err) {
    console.error("Error in posts debug:", err);
    return NextResponse.json({ error: "Debug failed", details: err.message }, { status: 500 });
  }
}