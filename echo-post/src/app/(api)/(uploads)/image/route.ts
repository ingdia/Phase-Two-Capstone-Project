// app/(api)/(uploads)/image/route.ts
import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";
import { checkRateLimit } from "../../../../lib/rateLimiter";
import { verifyTokenFromReq } from "../../../../lib/auth";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    // Check authentication - try both header and Authorization
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 });
    }

    const decoded = verifyTokenFromReq(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // Rate limiting
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Image size must be less than 10MB" }, { status: 400 });
    }


    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await new Promise<{ secure_url: string } | null>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "publisher" },
        (error, result) => {
          if (error) return reject(error);

          if (!result?.secure_url) return resolve(null);
          resolve({ secure_url: result.secure_url });
        }
      );
      const readable = Readable.from(buffer);
      readable.pipe(stream);
    }).catch(() => null);

    if (!upload) {

      const b64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${b64}`;
      const res = await cloudinary.uploader.upload(dataUri, { folder: "publisher" });
      return NextResponse.json({ url: res.secure_url });
    }

    return NextResponse.json({ url: upload.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
