import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/chat";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chats", err: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, title } = await req.json();
    const chat = await Chat.create({ userId, title });
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create chat", err: error }, { status: 500 });
  }
}
