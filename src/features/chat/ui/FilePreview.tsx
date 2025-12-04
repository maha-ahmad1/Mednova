import NextImage from "next/image";
import { FileIcon, Download, X } from "lucide-react";

interface FilePreviewProps {
  selectedFile: File | null;
  selectedPreview: string | null;
  uploadProgress: number;
  onRemoveFile: () => void;
}

export function FilePreview({ 
  selectedFile, 
  selectedPreview, 
  uploadProgress, 
  onRemoveFile 
}: FilePreviewProps) {
  if (!selectedFile || !selectedPreview) return null;

  const isImage = selectedFile.type.startsWith("image/");

  if (isImage) {
    return (
      <div className="mr-2 relative group">
        <div className="relative">
          <NextImage
            src={selectedPreview}
            alt="preview"
            width={60}
            height={60}
            className="w-15 h-15 object-cover rounded-lg border-2 border-[#32A88D]"
          />
          <button
            onClick={onRemoveFile}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110"
            type="button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mr-2 flex items-center gap-3 border border-[#32A88D]/20 rounded-xl p-3 bg-[#32A88D]/5">
      <div className="flex items-center justify-center w-12 h-12 bg-[#32A88D] rounded-lg">
        <FileIcon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 text-right">
        <div className="font-medium text-sm text-gray-800 truncate max-w-[120px]">
          {selectedFile.name}
        </div>
        <div className="text-xs text-gray-500">
          {(selectedFile.size / 1024).toFixed(1)} KB
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <a
          href={selectedPreview}
          download={selectedFile.name}
          className="text-[#32A88D] hover:text-[#2a8f7a] transition-colors"
          title="تحميل"
        >
          <Download className="w-4 h-4" />
        </a>
        <button
          onClick={onRemoveFile}
          className="text-red-500 hover:text-red-600 transition-colors"
          title="حذف"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}