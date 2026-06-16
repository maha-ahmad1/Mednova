"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

/**
 * Drop-in replacement for Button when an action has a loading state.
 * Automatically disables and shows a spinner while isLoading is true,
 * preventing double-clicks without any extra wiring.
 *
 * Usage:
 *   <LoadingButton isLoading={isPending} loadingText="Saving...">
 *     <SaveIcon /> Save
 *   </LoadingButton>
 */
export function LoadingButton({
  isLoading = false,
  loadingText,
  disabled,
  children,
  className,
  variant,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
