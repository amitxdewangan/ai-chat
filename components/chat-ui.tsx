"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, TextStreamChatTransport } from "ai";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Message from "./message";
import { useState, FormEvent } from "react";
import ChatInput from "./chat-input";

interface DBMessage {
  _id: string;
  sender: "user" | "assistant" | "system";
  text: string;
}

interface NormalizedMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
}

export default function ChatUI({ chatId }: { chatId: string }) {
  const [input, setInput] = useState("");

  // Load messages from DB
  const { data: dbMessages, isLoading } = useQuery<DBMessage[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => (await api.get(`/chats/${chatId}/messages`)).data,
  });

  // AI SDK for streaming messages
  const { messages: aiMessages, sendMessage, status, error } = useChat({
    // transport: new DefaultChatTransport({
    transport: new TextStreamChatTransport({
      api: `/api/chats/${chatId}/ai`, // connects to AI route
    }),
  });

   // Normalize DB messages
  const normalizedDb: NormalizedMessage[] = (dbMessages ?? []).map((m) => ({
    id: m._id,
    role: m.sender,
    text: m.text,
  }));

   // Normalize AI messages
  const normalizedAi: NormalizedMessage[] = (aiMessages ?? []).map((m, idx) => {
    const text = m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("");

    return {
      id: m.id ?? `ai-${idx}`,
      role: m.role as "user" | "assistant" | "system",
      text,
    };
  });


    // Final merged list
  const allMessages: NormalizedMessage[] = [...normalizedDb, ...normalizedAi];


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex justify-center h-full w-full bg-zinc-950">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-0 py-10 pb-28 sm:px-0 md:px-24 lg:px-64 space-y-12">
        {isLoading ? (
          <div className="text-center text-zinc-400">Loading messages...</div>
        ) : (
          allMessages.map((m) => (
            <Message key={m.id} sender={m.role} content={m.text} />
          ))
        )}
        
        {error && <p className="text-red-500 text-center">Error: {error.message}</p>}
      </div>
      
      {/* Input area */}
      <ChatInput
        input={input}
        setInput={setInput}
        status={status}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
}