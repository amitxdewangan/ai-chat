"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewChat from "./new-chat";
import { redirect } from "next/navigation";
import { LoaderCircle } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

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
    <SidebarMenu className="space-y-1 w-full">
      {isLoading ? (
        <LoaderCircle className="animate-spin mx-auto my-24 size-7 text-white" />
      ) : (
        chats?.map((chat: any) => {
          return (
            <SidebarMenuItem key={chat._id}>
              <SidebarMenuButton
                asChild
                variant="default"
                isActive={false}
                className="w-full justify-start px-2 transition-colors bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
              >
                <Link href={`/chats/${chat._id}`} className="w-full block text-left truncate">
                  <span>{chat.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })
      )}
    </SidebarMenu>
  );
}

// const [chats, setChats] = useState<string[]>(["First Chat"]);

//   const addChat = () => {
//     setChats([...chats, `New Chat ${chats.length + 1}`]);
//   };

