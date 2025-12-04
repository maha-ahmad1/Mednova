import { Send, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadMenu } from "./FileUploadMenu";
import { FilePreview } from "./FilePreview";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  selectedFile: File | null;
  selectedPreview: string | null;
  uploadProgress: number;
  showUploadMenu: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSendMessage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onOpenFilePicker: (type: "image" | "file") => void;
  onSetShowUploadMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isSending: boolean;
}

export function MessageInput({
  newMessage,
  setNewMessage,
  selectedFile,
  selectedPreview,
  uploadProgress,
  showUploadMenu,
  fileInputRef,
  onSendMessage,
  onFileChange,
  onRemoveFile,
  onOpenFilePicker,
  onSetShowUploadMenu,
  isSending,
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t bg-white p-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={onFileChange}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetShowUploadMenu((s) => !s)}
            className="p-2"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {showUploadMenu && (
            <FileUploadMenu
              onSelectImage={() => onOpenFilePicker("image")}
              onSelectFile={() => onOpenFilePicker("file")}
              onClose={() => onSetShowUploadMenu(false)}
            />
          )}
        </div>

        <FilePreview
          selectedFile={selectedFile}
          selectedPreview={selectedPreview}
          uploadProgress={uploadProgress}
          onRemoveFile={onRemoveFile}
        />

        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="اكتب رسالة..."
          className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-2xl bg-gray-100 border-none focus-visible:ring-0 px-4 py-3"
          rows={1}
        />

        <Button
          onClick={onSendMessage}
          disabled={(!newMessage.trim() && !selectedFile) || isSending}
          className="rounded-full h-10 w-10 p-0 bg-[#32A88D] hover:bg-[#2a8f7a]"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}