import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/message";

export async function PATCH(req: Request, { params }: { params: Promise<{ chatId: string; messageId: string }> }) {
  try {
    await connectDB();
    const data = await req.json();
    const { chatId, messageId } = await params;
    const updated = await Message.findOneAndUpdate(
      { _id: messageId, chatId: chatId },
      data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Message not updated" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message", err: error }, { status: 500 });
  }
}