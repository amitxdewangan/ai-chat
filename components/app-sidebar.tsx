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
import { cn } from "@/lib/utils";
import ChatList from "@/components/chat-list";
import { redirect } from "next/navigation";

export default function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
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
            {!collapsed ? (
              <div className="flex items-center justify-between mb-2">
                <SidebarHeader className={cn("text-lg font-bold text-white ml-1 uppercase")}>
                  AI chat
                </SidebarHeader>
                <SidebarTrigger variant="default" size="icon" className="hover:bg-zinc-700" />
              </div>
            ) : (
              <div className="flex items-center justify-center py-2">
                <div className="relative group inline-flex items-center">
                  <SidebarHeader className={cn("text-lg mb-0 font-bold text-white uppercase")}>
                    AI
                  </SidebarHeader>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <SidebarTrigger variant="default" size="lg" className="hover:bg-zinc-700" />
                  </div>
                </div>
              </div>
            )}

          <SidebarMenuButton
            onClick={() => redirect("/chats")}
            variant="default"
            size="lg"
            asChild={false}
            className="px-3 font-semibold text-zinc-100 hover:bg-zinc-800 hover:text-white space-x-1"
          >
            <div className="inline-flex items-center space-x-3 w-full py-1">
              <SquarePen className={cn("size-5", collapsed && "mx-auto")} />
              <span className={collapsed ? "hidden" : "visible"}>New Chat</span>
            </div>
          </SidebarMenuButton>

          {!collapsed && <SidebarSeparator className="bg-zinc-700 mt-2 mx-0" />}

          {/* Chats heading */}
          <div className={cn("bg-zinc-900 mt-2", collapsed && "hidden")}>
            <SidebarHeader className="text-zinc-300 text-sm uppercase font-semibold tracking-wider group-data-[collapsible=icon]:hidden">
              Chats
            </SidebarHeader>
          </div>
        </div>

        {/* Chats Lists */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent className={cn("flex-1 h-full max-h-full p-0", collapsed && "hidden")}>
            <ChatList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
