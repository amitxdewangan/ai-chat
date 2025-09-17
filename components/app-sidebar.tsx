"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import ChatList from "@/components/chat-list";
import { redirect } from "next/navigation";

export default function AppSidebar() {
  return (
    <Sidebar className="h-screen w-1/6 border-r border-zinc-700 flex flex-col p-0">
      <SidebarContent className="flex flex-col h-full p-0 bg-zinc-900 custom-scrollbar">
        <div className=" z-10 px-2 bg-zinc-900">
          <div className="sticky top-0 z-10 px-2 pb-2 bg-zinc-900">
            {/* Icon & Sidebar Trigger */}
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-lg font-bold text-white">AI chat</h1>
              <SidebarTrigger variant="default" size="icon" className="hover:bg-zinc-700" />
            </div>
            <Button
              onClick={() => redirect("/chats")}
              variant="default"
              size="default"
              className="w-full justify-start font-semibold text-zinc-100 hover:bg-zinc-700 space-x-1"
            >
              <SquarePen className="size-5" />
              <span>New Chat</span>
            </Button>
            <div className="sticky z-10 px-2 py-2 mt-4 border-t border-zinc-700">
              <SidebarGroupLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                Chats
              </SidebarGroupLabel>
            </div>
          </div>
          
          <div className="space-y-1 w-full h-screen">
            <ChatList />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
