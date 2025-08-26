"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function Sidebar() {
  const [chats, setChats] = useState<string[]>(["First Chat"]);

  const addChat = () => {
    setChats([...chats, `New Chat ${chats.length + 1}`]);
  };

  return (
    <aside className="hidden md:flex w-64 bg-zinc-900 p-4 flex-col border-r border-zinc-800">
      <h1 className="text-lg font-bold mb-6">ChatGPT Clone</h1>

      <nav className="flex flex-col gap-2 flex-1">
        <button
          onClick={addChat}
          className="flex items-center gap-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        {/* Chat list */}
        <div className="mt-4 flex flex-col gap-1 text-sm">
          {chats.map((chat, idx) => (
            <div
              key={idx}
              className="p-2 rounded-md hover:bg-zinc-800 cursor-pointer"
            >
              {chat}
            </div>
          ))}
        </div>
      </nav>

      <div className="mt-auto text-sm text-zinc-400">
        Logged in as Guest
      </div>
    </aside>
  );
}
