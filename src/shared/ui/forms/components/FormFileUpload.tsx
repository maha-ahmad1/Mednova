"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface FormFileUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rtl?: boolean;
  icon?: React.ElementType;
  error?: string;
  iconPosition?: "left" | "right";
}

export const FormFileUpload = React.forwardRef<
  HTMLInputElement,
  FormFileUploadProps
>(
  (
    {
      label,
      rtl,
      icon: Icon = Upload,
      error,
      className,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-2">
        <Label
          className={cn(
            "text-sm font-medium",
            rtl ? "text-right" : "text-left"
          )}
        >
          {label}
        </Label>

        <div
          className={cn(
            " border rounded-md px-2 py-2 bg-white shadow-sm",
            error && "border-red-500",
            rtl && "flex-row-reverse text-right"
          )}
        >
          <div className="relative">
            {Icon && iconPosition === "left" && (
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none",
                  rtl ? "right-3" : "left-3"
                )}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <Input
              ref={ref}
              type="file"
              className={cn(
                "border-0 shadow-none p-0 text-sm focus-visible:ring-0",
                className
              )}
              {...props}
            />
            {Icon && iconPosition === "right" && (
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none",
                  rtl ? "left-3" : "right-3"
                )}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormFileUpload.displayName = "FormFileUpload";
