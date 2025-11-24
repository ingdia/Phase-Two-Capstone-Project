import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    return NextResponse.json({ 
      message: "Slug route working", 
      slug: slug,
      timestamp: new Date().toISOString() 
    });
  } catch (err) {
    console.error("Error in test slug route:", err);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}