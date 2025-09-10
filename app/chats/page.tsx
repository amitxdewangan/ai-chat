"use client";

import ChatInput from "@/components/chat-input";
import { useState } from "react";

export default function NewChat() {
  const [input, setInput] = useState("");
  // Dummy handlers for demo
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800">
      <div className="flex flex-col items-center w-full max-w-xl mx-auto mb-10 mt-36">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-zinc-100 mb-4">
          Start a new chat
        </h1>
        <p className="text-zinc-400 text-center mb-10 max-w-md">
          This is a new conversation. Ask anything and get instant answers powered by AI.<br/>
          Your messages are private and not stored.
        </p>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        status={"ready"}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        className="shadow-lg shadow-zinc-700 border border-zinc-800"
      />
    </div>
  );
}
