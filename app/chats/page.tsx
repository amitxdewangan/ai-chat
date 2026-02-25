"use client";

import ChatInput from "@/components/chat-input";
import { LoaderCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function NewChat() {
  const [input, setInput] = useState("");
  const router = useRouter()
  const qc = useQueryClient();
  const { data: session, status: sessionStatus } = useSession({ required: true, onUnauthenticated() { router.push("/user/login"); } });
  const userId = session?.user?.id;

  // Create new chat
  const createChat = useMutation({
    mutationFn: async () =>
      // (await api.post("/chats", { userId: "64a2c9f1e9a4b8d1f8a12345", title: "New Chat 79" })).data,
      // Pass the logged-in user's id from the session to the API
      (await api.post("/chats", { userId: userId, title: "New Chat 79" })).data,

    onSuccess: (data) => {
      // console.log("Chat created, data: ", data);

      // Redirect to the new chat and pass the initial message via query string
      router.replace(`/chats/${data._id}?firstMessage=${encodeURIComponent(input)}`);

      qc.invalidateQueries({ queryKey: ["chats"] }); // refetch chats after creating
    },

    onError: (error) => {
      // console.error("Error creating chat: ", error);

      // Show alert notification
      alert("Error creating chat");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    createChat.mutate()
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
          status={createChat.status === "pending" ? "loading" : "ready"}
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          className="shadow-lg shadow-zinc-700 border border-zinc-800"
        />

        {createChat.status === "pending" && (
          <div className="flex items-center justify-center mt-8 text-zinc-100">
            <LoaderCircle className="animate-spin mr-2 size-8" />
            <span>Creating chat...!!</span>
          </div> 
        )} 
    </div>
  );
}
