"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { LoaderCircle } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChatList() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession( { required: true, onUnauthenticated() { router.push("/user/login"); } });
  const userId = session?.user?.id;

  // Fetch all chats for the logged-in user
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => (await api.get(`/chats?userId=${userId}`)).data,
    staleTime: Infinity, // chats don't change often, we can cache them indefinitely
  });

  return (
    <SidebarMenu className="space-y-1 w-full">
      {isLoading ? (
        <LoaderCircle className="animate-spin mx-auto my-24 size-7 text-white" />
      ) : (
        chats?.map((chat: { _id: string; title: string }) => {
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

