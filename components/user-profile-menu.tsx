"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function UserProfileMenu() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/user/login");
  };

  const name = session?.user?.name ?? "Unknown";
  const email = session?.user?.email ?? "";
  const image = session?.user?.image ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="default" className="w-full py-6 hover:bg-zinc-800 flex items-center justify-start">
          {image ? (
            // Image component used if available
            <Image src={image} alt={name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium text-white">
              {name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
          )}
          <div className="flex flex-col items-start ml-1">
            <span className="hidden sm:block text-sm font-medium text-white">{name}</span>
            <span className="text-xs text-zinc-400">Free</span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-3 bg-zinc-900 text-zinc-100 border border-zinc-700">
        <div className="flex items-center gap-3 px-1 pb-2">
          {image ? (
            <Image src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-white">
              {name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
          )}

          <div className="flex flex-col truncate">
            <div className="font-medium truncate">{name}</div>
            <div className="text-xs text-zinc-400 truncate">{email}</div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            router.push("/user/profile");
          }}
          className="text-sm focus:bg-zinc-800 focus:text-accent"
        >
          View profile
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
          className="mt-2"
        >
          <Button variant="secondary" size="sm" className="w-full text-sm">Sign out</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}