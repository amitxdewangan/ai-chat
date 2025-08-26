"use client";

import { useState } from "react";
import Message from "@/components/ui/message";

export default function ChatUI() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-zinc-950">
        {messages.map((msg, idx) => (
          <Message key={idx} role={msg.role} content={msg.content} />
        ))}
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-2">
          <textarea
            className="flex-1 resize-none rounded-lg bg-zinc-900 p-2 text-zinc-100 focus:outline-none"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-accent-green hover:bg-accent-green-dark text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}