"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Message from "./message";
import { useState, FormEvent, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [queryEnabled, setQueryEnabled] = useState(true);
  const hasMounted = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const firstSentRef = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      setQueryEnabled(false);
    }
  }, []);

  // Load messages from DB
  const { data: dbMessages, isLoading } = useQuery<DBMessage[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => (await api.get(`/chats/${chatId}/messages`)).data,
    enabled: queryEnabled,
  });

  // AI SDK for streaming messages
  const { messages: aiMessages, sendMessage, status, error } = useChat({
    // transport: new DefaultChatTransport({
    transport: new TextStreamChatTransport({
      api: `/api/chats/${chatId}/ai`, // connects to AI route
    }),
  });

  // If the URL contains ?firstMessage=..., send it once and then remove the param
  useEffect(() => {
    const firstMessage = searchParams?.get?.("firstMessage") ?? null;
    if (firstMessage && !firstSentRef.current) {
      firstSentRef.current = true;

      // send the initial message
      sendMessage({ text: firstMessage });
      
      // remove the query param so it's not resent on navigation or remount
      router.replace(`/chats/${chatId}`);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, chatId, sendMessage]);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [allMessages.length]);

  return (
    <div className="flex justify-center h-full w-full bg-gradient-to-b from-zinc-900 to-zinc-950">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-0 py-10 pb-28 sm:px-0 md:px-24 lg:px-64 space-y-12 custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-zinc-400">Loading messages...</div>
          ) : (
            <>
              {allMessages.map((m) => (
                <Message key={m.id} sender={m.role} content={m.text} />
              ))}
              <div ref={messagesEndRef} />
            </>
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
        className="fixed bottom-4 border border-zinc-800 shadow-md shadow-zinc-800"
      />
    </div>
  );
}