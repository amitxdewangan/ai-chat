import ChatUI from "@/components/chat-ui";

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params; // await here

  return (
    <ChatUI chatId={chatId} />
  );
}
