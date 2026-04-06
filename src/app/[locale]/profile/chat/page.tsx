import ChatPage from "@/features/chat/ui/ChatPage";

export const dynamic = 'force-dynamic';

export default function Chat() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ChatPage  />
    </div>
  );
}
