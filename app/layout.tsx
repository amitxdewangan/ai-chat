import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/app-sidebar";
import Providers from "./providers";
import { SidebarProvider } from "@/components/ui/sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chat",
  description: "An AI chat application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen flex bg-zinc-950 text-zinc-100`}
      >
        <Providers>
          <SidebarProvider>
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Chat */}
            <main className="flex-1 flex flex-col">
              {children}
            </main>

          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
