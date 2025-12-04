import { ImageIcon, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadMenuProps {
  onSelectImage: () => void;
  onSelectFile: () => void;
  onClose: () => void;
}

export function FileUploadMenu({ onSelectImage, onSelectFile, onClose }: FileUploadMenuProps) {
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 min-w-[180px] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">إرفاق ملف</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-100"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-2">
        <button
          onClick={onSelectImage}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#32A88D]/10 transition-colors duration-200 border border-transparent hover:border-[#32A88D]/20"
          type="button"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <ImageIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-medium text-gray-800">صورة</div>
            <div className="text-xs text-gray-500">JPG, PNG, GIF</div>
          </div>
        </button>

        <button
          onClick={onSelectFile}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#32A88D]/10 transition-colors duration-200 border border-transparent hover:border-[#32A88D]/20"
          type="button"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
            <File className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-medium text-gray-800">ملف</div>
            <div className="text-xs text-gray-500">PDF, DOC, ZIP</div>
          </div>
        </button>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">الحجم الأقصى: 10MB</p>
      </div>
    </div>
  );
}