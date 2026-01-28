"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, User, Pencil } from "lucide-react"
import { toast } from "sonner"
import { useUpdateProfileImage , type UserType } from "@/features/profile/_views/hooks/useUpdateProfileImage"
import Image from "next/image"


interface SidebarImageEditorProps {
  currentImage: string
  userType: UserType
  userId?: string
  refetch?: () => void
}

export const SidebarImageEditor: React.FC<SidebarImageEditorProps> = ({ currentImage, userType, userId, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { updateImage, isUpdating } = useUpdateProfileImage({
    userType,
    userId,
    onSuccess: () => {
      setIsModalOpen(true)
      setPreviewImage(null)
      setSelectedFile(null)

    },
    onError: (error) => {
      console.error("Image update failed:", error)
    },
    refetch,
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة صالحة")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت")
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error("يرجى اختيار صورة")
      return
    }

    await updateImage({
      image: selectedFile,
      customer_id: userId,
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setPreviewImage(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const modalPreviewImage = previewImage || currentImage

  return (
    <>
      <div className="relative group">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
          {currentImage && currentImage !== "/images/placeholder.svg" ? (
            <Image  src={currentImage || "./images/placeholder.svg"} alt="Profile" width={100} height={100} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-0 right-0 bg-[#32A88D] text-white rounded-full p-2 hover:bg-[#2b8e77] transition-all shadow-md group-hover:scale-110"
          title="تغيير الصورة"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">تحديث صورة الملف الشخصي</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#32A88D]/20">
              {modalPreviewImage && modalPreviewImage !== "/images/placeholder.svg" ? (
                <Image
                  src={modalPreviewImage || "./images/placeholder.svg"}
                  alt="Preview"
                  className="object-cover w-full h-full"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />

            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              اختر صورة جديدة
            </Button>

            {/* {selectedFile && <p className="text-sm text-gray-500">{selectedFile.name}</p>} */}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating}>
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!selectedFile || isUpdating}
              className="bg-[#32A88D] hover:bg-[#2b8e77]"
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
