import { NextResponse } from "next/server";
import { streamText } from "ai";
import { connectDB } from "@/lib/db";
import Message from "@/models/message";
import groq from "@/lib/groq";

export async function POST(req: Request, { params }: { params: { chatId: string }}) {
  try {
    await connectDB();

    const { content } = await req.json();

    // 1. Save the user's message first
    await Message.create({
      chatId: params.chatId,
      sender: "user",
      content,
    });

    // 2. Fetch full chat history for context
    const history = await Message.find({ chatId: params.chatId }).sort({ createdAt: 1 });

    // 3. Convert DB messages into AI SDK format
    const messages = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    })) as { role: "user" | "assistant"; content: string }[];

    // 4. Stream response from Groq
    const result = await streamText({
      model: groq("llama3-70b-8192"), // you can also use "llama-3.1-8b-instant"
      messages,
    });

    // 5. Save assistant’s full reply once completed
    const fullReply = await result.text;
    await Message.create({
      chatId: params.chatId,
      sender: "assistant",
      content: fullReply,
    });

    // 6. Return streaming response to frontend
    return result.toTextStreamResponse();
  }
  catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
  }
}
