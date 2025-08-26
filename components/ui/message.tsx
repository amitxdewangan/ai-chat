import { cn } from "@/lib/utils";

export default function Message({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser ? "bg-accent-green text-white" : "bg-zinc-800 text-zinc-100"
        )}
      >
        {content}
      </div>
    </div>
  );
}
