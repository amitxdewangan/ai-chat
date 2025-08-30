import { NextResponse } from "next/server";
import { convertToModelMessages, streamText } from "ai";
import { connectDB } from "@/lib/db";
import Message from "@/models/message";
import groq from "@/lib/groq";

export const maxDuration = 300;

export async function POST(req: Request, { params }: {  params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params;
    await connectDB()

    const { messages } = await req.json();

    // const body = await req.json();
    // console.log("Incoming body:", body);

    // const { messages } = body;
    // console.log("Received messages:", messages);


    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const lastMessageObject = messages[messages.length - 1];
    // console.log("Last message role:", lastMessageObject.role);

    const lastUserMessage = lastMessageObject.parts[0].text;
    // console.log("User message:", lastUserMessage);

    if (lastMessageObject.role !== "user" || !lastUserMessage) {
      return NextResponse.json({ error: "User message is required" }, { status: 400 });
    }

    // 1. Save the user's message first
    await Message.create({
      chatId,
      sender: "user",
      text: lastUserMessage,
    });

    // 2. Fetch full chat history for context
    // Will use to create the memory context using mem0
    // const history = await Message.find({ chatId: chatId }).sort({ createdAt: 1 });
    // console.log("Chat history:", history);

    //  3. Convert DB messages into AI SDK format
    // const formattedHistory = history.map((msg) => ({
    //   role: msg.sender as "user" | "assistant",
    //   content: msg.text as string,
    // }));

    // console.log("Formatted history:", formattedHistory);

    // 4. Stream response from Groq
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      system: "You're a helpful AI assistant. Keep responses concise and relevant.",
      prompt: convertToModelMessages(messages),
      maxOutputTokens: 1000,
      onFinish: async (aiResponse) => {
        // Save the full response text to the database
        await Message.create({
          chatId: chatId,
          sender: "assistant",
          text: aiResponse.text,
        });
      },
    });
    
    // 5. Save assistant’s full reply once completed
    // const fullReply = await result.text;

    // const aiResponse = await Message.create({
    //   chatId: chatId,
    //   sender: "assistant",
    //   text: fullReply,
    // });

    // 6. Return streaming response to frontend
    //  return result.toUIMessageStreamResponse({ headers: { "Content-Type": "text/event-stream" }, statusText: "Got AI Response" });
    return result.toTextStreamResponse();
  }
  catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "AI processing failed", details: error }, { status: 500 });
  }
}
