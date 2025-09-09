"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewChat from "./new-chat";
import { redirect } from "next/navigation";
import { LoaderCircle, SquarePen } from "lucide-react"

export default function ChatList() {
  const qc = useQueryClient();

  // Fetch all chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => (await api.get("/chats?userId=64a2c9f1e9a4b8d1f8a12345")).data,
  });

  // Create new chat
  const createChat = useMutation({
    mutationFn: async () =>
      (await api.post("/chats", { userId: "64a2c9f1e9a4b8d1f8a12345", title: "New Chat" })).data,
    
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chats"] }), // refetch chats after creating
  });

  return (
    <div className="max-h-screen overflow-y-scroll px-2 py-6 w-1/6 custom-scrollbar">
      {/* <Button onClick={() => createChat.mutate()}>+ New Chat</Button> */}
      <Button 
        onClick={() => redirect("/chats")}
        variant="ghost" 
        size="default" 
        className="w-full justify-start mb-4 hover:text-white hover:bg-zinc-800 space-x-1"
      >
        <SquarePen className="size-5" />
        <span>New Chat</span>
      </Button>

      <ul className="mt-4 space-y-1">
        <p className="text-zinc-200 mb-2 px-3 py-1">Chats</p>
        {isLoading ? (
          <LoaderCircle className="animate-spin mx-auto my-24 size-7" />
        ) : (
          chats?.map((chat: any) => (
          <Button 
            key={chat._id}
            variant="ghost" 
            size="sm" 
            className="w-full justify-start hover:text-white hover:bg-zinc-800"
          >
            <Link href={`/chats/${chat._id}`}>
              {chat.title}
            </Link>
          </Button>
          ))
        )}
      </ul>
    </div>
  );
}
