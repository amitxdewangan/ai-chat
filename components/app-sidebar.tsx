"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SquarePen } from "lucide-react";
import ChatList from "@/components/chat-list";
import { redirect } from "next/navigation";

export default function AppSidebar() {
  const { state } = useSidebar();
  
  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="h-screen w-64 border-r border-zinc-700 flex flex-col p-0"
    >
      <SidebarContent className="flex flex-col p-0 gap-0 bg-zinc-900 custom-scrollbar">

        {/* Sticky header: app title, trigger, new chat button */}
        <div className="sticky top-0 z-20 bg-zinc-900 px-2 pt-2 pb-3">
          <div className="flex items-center justify-between mb-2">
            <SidebarHeader className="text-lg font-bold text-white ml-1 uppercase">AI chat</SidebarHeader>
            <SidebarTrigger variant="default" size="icon" className="hover:bg-zinc-700" />
          </div>
          
          <SidebarMenuButton
            onClick={() => redirect("/chats")}
            variant="default"
            size="lg"
            asChild={false}
            className="px-3 font-semibold text-zinc-100 hover:bg-zinc-800 hover:text-white space-x-1"
          >
            <div className="inline-flex items-center space-x-3 w-full py-1">
              <SquarePen className="size-5" />
              <span>New Chat</span>
            </div>
          </SidebarMenuButton>

          <SidebarSeparator className="bg-zinc-700 mt-2 mx-0" />

          {/* Chats heading */}
          <div className="bg-zinc-900 mt-2">
            <SidebarHeader className="text-zinc-300 text-sm uppercase font-semibold tracking-wider group-data-[collapsible=icon]:hidden">
              Chats
            </SidebarHeader>
          </div>
        </div>

        {/* Chats Lists */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent className="flex-1 h-full max-h-full p-0">
            <ChatList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
