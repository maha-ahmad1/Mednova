import { memo } from "react";
import NextImage from "next/image";
import { FileIcon } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isMyMessage: boolean;
}

const MessageBubble = memo(({ message, isMyMessage }: MessageBubbleProps) => {
  const isOptimistic = message.status === "sending";
  
  const formatTime = (dateString: string) => {
    try {
      if (dateString.includes("PM") || dateString.includes("AM")) {
        return dateString;
      }
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return "--:--";
    } catch (error) {
      return "--:--";
    }
  };

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end gap-2 max-w-[75%] ${
          isMyMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`px-3 py-2 text-sm rounded-2xl shadow-sm whitespace-pre-wrap ${
            isMyMessage
              ? "bg-[#DCF8C6] rounded-br-none"
              : "bg-white rounded-bl-none"
          }`}
        >
          <p>{message.message}</p>
          
          {message.attachment && message.attachment_type === "image" && (
            <div className="mt-2">
              <NextImage
                src={typeof message.attachment === "string" ? message.attachment : ""}
                alt="attachment"
                width={200}
                height={120}
                className="rounded-md object-cover"
              />
            </div>
          )}

          {message.attachment && message.attachment_type !== "image" && (
            <div className="mt-2">
              <a
                href={typeof message.attachment === "string" ? message.attachment : "#"}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                ملف مرفق
              </a>
            </div>
          )}
          
          <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-600">
            {isOptimistic ? (
              <span className="text-gray-400">-:-</span>
            ) : (
              <>{formatTime(message.created_at)}</>
            )}

            {isMyMessage && (
              <span
                className={`mr-1 flex items-center ${
                  message.is_read ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {message.is_read ? <span>✓✓</span> : <span>✓</span>}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

export { MessageBubble };