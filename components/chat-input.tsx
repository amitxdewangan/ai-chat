import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FormEvent } from "react";
import { CircleArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  status: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export default function ChatInput({ input, setInput, status, handleSubmit, handleKeyDown, className }: ChatInputProps) {

  return (
    <div className={cn("w-[80%] max-w-4xl mx-auto flex justify-center items-center flex-1 rounded-3xl z-10", className)}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full rounded-3xl"
      >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status !== "ready"}
            className="w-full resize-none border-none py-3 pr-24 pl-6 rounded-3xl bg-zinc-900 text-zinc-100 min-h-12 focus-visible:ring-0 focus-visible:shadow-md focus-visible:shadow-zinc-700 placeholder:text-zinc-500"
            placeholder="Ask Anything"
            rows={1}
            maxLength={5000}
          />
          <Button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="absolute bottom-1 right-2.5 w-fit h-fit p-1.5 rounded-full disabled:opacity-50"
            variant="secondary"
            size="icon"
          >
            <CircleArrowUp className="size-7" />
          </Button>
      </form>
    </div>
  );
}
