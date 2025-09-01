import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/message";

export async function GET(_: Request, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params; // await params here

    await connectDB();
    const messages = await Message.find({ chatId: chatId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages", err: error }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params; // await params here

    await connectDB();
    
    const { text } = await req.json();
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Message text required" }, { status: 400 });
    }

     // Instead of directly saving, forward to the AI route
    const aiRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/app/api/chats/${chatId}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    
    const aiData = await aiRes.json();

    return NextResponse.json(aiData, { status: aiRes.status });

    // const message = await Message.create({ chatId: chatId, sender, content });
    // return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message", err: error }, { status: 500 });
  }
}
