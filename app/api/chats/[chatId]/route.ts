import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/chat";

export async function GET(_: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectDB();
    const chat = await Chat.findById(params.chatId);
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    return NextResponse.json(chat);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chat", err: error }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectDB();
    const data = await req.json();
    const updated = await Chat.findByIdAndUpdate(params.chatId, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chat", err: error }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { chatId: string } }) {
  try {
    await connectDB();
    await Chat.findByIdAndDelete(params.chatId);
    return NextResponse.json({ message: "Chat deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chat", err: error }, { status: 500 });
  }
}
