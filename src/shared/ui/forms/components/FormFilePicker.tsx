"use client";

import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type FormFilePickerProps = {
  label: string;
  name: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  error?: string;
  icon?: React.ElementType;
  placeholder?: string;
  rtl?: boolean;
  disabled?: boolean;
};

export function FormFilePicker({
  label,
  name,
  file,
  onChange,
  accept,
  error,
  icon: Icon = Upload,
  placeholder = "اختر ملفًا",
  rtl,
  disabled,
}: FormFilePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label className={cn("text-sm font-medium", rtl ? "text-right" : "text-left")}>
        {label}
      </Label>

      <div className={cn("flex items-center gap-2", rtl && "flex-row-reverse")}>
        <div className="relative flex-1">
          {Icon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                rtl ? "right-3" : "left-3"
              )}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <Input
            type="text"
            readOnly
            value={file?.name ?? ""}
            placeholder={placeholder}
            className={cn(
              "bg-white",
              Icon ? (rtl ? "pr-10" : "pl-10") : undefined,
              error && "border-red-500"
            )}
          />
          <Input
            ref={inputRef}
            name={name}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            disabled={disabled}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
        >
          اختيار
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
