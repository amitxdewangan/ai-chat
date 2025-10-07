"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { LoaderCircle } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export default function ChatList() {
  const pathname = usePathname();

  // Fetch all chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => (await api.get("/chats?userId=64a2c9f1e9a4b8d1f8a12345")).data,
  });

  return (
    <SidebarMenu className="space-y-1 w-full">
      {isLoading ? (
        <LoaderCircle className="animate-spin mx-auto my-24 size-7 text-white" />
      ) : (
        chats?.map((chat: any) => {
          const chatPath = `/chats/${chat._id}`;
          const isActive = pathname === chatPath;
          return (
            <SidebarMenuItem key={chat._id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={`w-full justify-start px-2 transition-colors bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white ${isActive && "bg-zinc-700! text-white!"}`}
              >
                <Link href={chatPath} className="w-full block text-left truncate">
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

