import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set in env");

export type JwtPayload = { id: string; iat?: number; exp?: number };

export function verifyTokenFromReq(req: Request): JwtPayload | null {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) return null;
  const token = auth.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function requireAuthenticated(req: Request) {
  const decoded = verifyTokenFromReq(req);
  if (!decoded) {
    throw new Error("Unauthorized");
  }
  return decoded;
}

export function signToken(payload: { id: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
