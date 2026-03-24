import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const video = await redis.get("active_video");
    return NextResponse.json({ video: video || "myvid1.mp4" });
  } catch (error) {
    console.error("Redis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { video } = await request.json();
    if (!video) {
      return NextResponse.json(
        { error: "Video filename is required" },
        { status: 400 }
      );
    }
    await redis.set("active_video", video);
    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("Redis error:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}
