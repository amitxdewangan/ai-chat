import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FormEvent } from "react";
import { CircleArrowUp } from "lucide-react"

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  status: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatInput({ input, setInput, status, handleSubmit, handleKeyDown }: ChatInputProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 w-full max-w-4xl mx-auto px-4 py-5 flex justify-center items-center z-10"
    >
      <div className="relative w-full flex-1">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={status !== "ready"}
          className="w-full resize-none border-none py-3 pr-24 pl-6 rounded-3xl bg-zinc-900 text-zinc-100 min-h-12 focus-visible:ring-0 focus-visible:shadow-md focus-visible:shadow-zinc-700"
          placeholder="Ask Anything"
          rows={1}
          maxLength={5000}
        />
        <Button
          type="submit"
          disabled={status !== "ready" || !input.trim()}
          className="absolute bottom-1.5 right-3 w-fit h-fit p-1.5 rounded-full disabled:opacity-50"
          variant="secondary"
          size="icon"
        >
          <CircleArrowUp className="size-6" />
        </Button>
      </div>
    </form>
  );
}
