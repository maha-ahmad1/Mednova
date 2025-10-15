import * as React from "react"
import { Button} from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FormSubmitButtonProps  {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  ({ isLoading = false, loadingText = "جاري التحميل...", children, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="submit"
        className={cn("w-full bg-[#32A88D] hover:bg-[#32A88D]/90 text-primary-foreground font-semibold", className)}
        size="lg"
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? loadingText : children}
      </Button>
    )
  },
)

FormSubmitButton.displayName = "FormSubmitButton"

export { FormSubmitButton }
