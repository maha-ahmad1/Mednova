"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FormFileUpload } from "@/shared/ui/forms/components/FormFileUpload";

type ProfileImageUploadProps = {
  label: string;
  file: File | null;
  initialImage?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  rtl?: boolean;
  removeLabel?: string;
};

export function ProfileImageUpload({
  label,
  file,
  initialImage = null,
  onChange,
  error,
  rtl,
  removeLabel = "إزالة الصورة",
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage);

  useEffect(() => {
    if (!file) {
      setPreview(initialImage ?? null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);

    return () => {
      reader.abort();
    };
  }, [file, initialImage]);

  return (
    <div className="space-y-3">
      <FormFileUpload
        label={label}
        rtl={rtl}
        accept="image/*"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] ?? null;
          onChange(selectedFile);
        }}
        error={error}
        className="bg-white"
      />
      {preview && (
        <div className="space-y-2">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
            <Image src={preview} alt="Profile preview" fill className="object-cover" />
          </div>
          {file && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-sm text-red-500 hover:underline"
            >
              {removeLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
