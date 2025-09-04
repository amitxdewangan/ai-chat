
export default function Message({ sender, content }: { sender: "user" | "assistant" | "system"; content: string; }) {
  // Treat "system" similar to assistant visually
  const role = sender === "system" ? "assistant" : sender;

  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl drop-shadow-sm drop-shadow-zinc-800 whitespace-pre-line ${
          role === "user"
            ? "bg-zinc-800 text-white max-w-[60%]"
            : "text-zinc-100"
        }`}
      >
        {content}
      </div>
    </div>
  );
}