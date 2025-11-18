import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, username, password } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email or username
    const [emailExists, usernameExists] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (emailExists) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    if (usernameExists) return NextResponse.json({ error: "Username already taken" }, { status: 400 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, username, password: hashedPassword },
      select: { id: true, name: true, email: true, username: true },
    });

    
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
