import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
    return decoded;
  } catch {
    throw new Error("Invalid token");
  }
}
