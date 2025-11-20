import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "./src/lib/rateLimiter";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon";
    const rl = checkRateLimit(String(ip));
    if (!rl.ok) return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
