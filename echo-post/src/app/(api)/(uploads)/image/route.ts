// app/api/uploads/image/route.ts
import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";
import { checkRateLimit } from "../../../../lib/rateLimiter";
import { Readable } from "stream";
export const config = { api: { bodyParser: false } }; 

export async function POST(req: Request) {
  try {
    
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").toString();
    const rl = checkRateLimit(ip);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const form = await req.formData();
    const file = form.get("file") as unknown as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

 
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
