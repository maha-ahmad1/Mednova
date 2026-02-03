"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FormInput } from "./FormInput";

interface ProfileImageUploadProps {
  label: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  rtl?: boolean;
}

export function ProfileImageUpload({
  label,
  value,
  onChange,
  accept = "image/*",
  rtl = true,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormInput
        label={label}
        type="file"
        accept={accept}
        rtl={rtl}
        onChange={handleFileChange}
        ref={inputRef}
      />

      {preview && (
        <div>
          <Image
            width={100}
            height={100}
            src={preview || "/images/placeholder.svg"}
            alt="معاينة الصورة"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-red-500 hover:underline"
          >
            إزالة الصورة
          </button>
        </div>
      )}
    </div>
  );
}
