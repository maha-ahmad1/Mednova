import * as React from "react"
import { Button, type buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

export interface FormSubmitButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  align?: "left" | "right" | "center" 
}

const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  (
    {
      isLoading = false,
      loadingText = "جاري التحميل...",
      children,
      className,
      disabled,
      variant,
      size,
      align = "right", 
      ...props
    },
    ref,
  ) => {
    const alignmentClass =
      align === "left"
        ? "justify-start"
        : align === "center"
        ? "justify-center"
        : "justify-end"

    return (
      <div className={cn("flex w-full cursor-pointer", alignmentClass)}>
        <Button
          ref={ref}
          type="submit"
          variant={variant}
          size={size}
          disabled={isLoading || disabled}
          className={cn("cursor-pointer", className)}
          {...props} 
        >
          {isLoading ? loadingText : children}
        </Button>
      </div>
    )
  },
)

FormSubmitButton.displayName = "FormSubmitButton"

export { FormSubmitButton }
