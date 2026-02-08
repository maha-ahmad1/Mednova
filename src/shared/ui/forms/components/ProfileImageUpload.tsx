"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FormInput } from "./FormInput";
import { Upload } from "lucide-react"; 

interface ProfileImageUploadProps {
  label: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  rtl?: boolean;
  error?: string | undefined;
  required?: boolean;
}

export function ProfileImageUpload({
  error,
  label,
  value,
  onChange,
  accept = "image/*",
  rtl = true,
  required = false,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(typeof reader.result === "string" ? reader.result : null);
      };
      reader.readAsDataURL(value);
      return () => reader.abort();
    }

    if (typeof value === "string" && value?.length > 0) {
      setPreview(value);
      return;
    }

    setPreview(null);
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    const file = event.target.files?.[0] ?? null;
    onChange(file);

    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setIsTouched(true);
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    setIsTouched(true);
    inputRef.current?.click();
  };

  // تحديد إذا كان يجب عرض الخطأ
  const showError = error && (isTouched || value !== undefined);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      <div className="flex flex-col md:flex-row gap-5">
        {/* حقل رفع الملف مع تصميم مخصص */}
        <div className="w-full">
          <div
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              transition-all duration-200 ease-in-out
              hover:border-primary-400 hover:bg-primary-50/50
              ${showError 
                ? "border-red-500 bg-red-50/50 hover:border-red-600" 
                : preview 
                  ? "border-green-200 bg-green-50/30" 
                  : "border-gray-300 dark:border-gray-600"
              }
              ${rtl ? "text-right" : "text-left"}
            `}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClick();
              }
            }}
          >
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className={`
                p-2 rounded-full
                ${showError 
                  ? "bg-red-100 text-red-600" 
                  : preview 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }
              `}>
                <Upload className="w-6 h-6" />
              </div>
              
              <div>
                <p className={`
                  text-sm font-medium
                  ${showError 
                    ? "text-red-700" 
                    : "text-gray-700 dark:text-gray-300"
                  }
                `}>
                  {preview 
                    ? "تم رفع الصورة بنجاح" 
                    : showError 
                      ? "انقر لرفع صورة المركز" 
                      : "انقر لرفع صورة المركز"
                  }
                </p>
                
                <p className={`
                  text-xs mt-1
                  ${showError 
                    ? "text-red-600" 
                    : "text-gray-500 dark:text-gray-400"
                  }
                `}>
                  {accept.includes("image/*") 
                    ? "الصيغ المدعومة: JPG, PNG, WebP, GIF" 
                    : "اختر ملفاً"}
                </p>
              </div>
            </div>
          </div>
          
          {showError && (
            <div className="mt-2 flex items-start space-x-2 space-x-reverse">
              <svg 
                className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
        
        {/* معاينة الصورة */}
        {preview && (
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Image
                width={100}
                height={100}
                src={preview || "/images/placeholder.svg"}
                alt="معاينة صورة المركز"
                className="w-28 h-28 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors"
            >
              إزالة الصورة
            </button>
          </div>
        )}
      </div>
      
      {/* حالة عندما لا توجد صورة ولا خطأ - رسالة توجيهية */}
      {!preview && !showError && required && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          هذا الحقل مطلوب. يرجى رفع صورة للمركز.
        </p>
      )}
    </div>
  );
}