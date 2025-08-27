import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/message";

export async function GET(_: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectDB();
    const messages = await Message.find({ chatId: params.chatId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages", err: error }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectDB();
    const { sender, content } = await req.json();
    const message = await Message.create({ chatId: params.chatId, sender, content });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create message", err: error }, { status: 500 });
  }
}
