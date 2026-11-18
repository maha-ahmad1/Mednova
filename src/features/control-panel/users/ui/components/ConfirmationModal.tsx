import type { ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  confirmDisabled?: boolean;
  isConfirming?: boolean;
  /** Shown next to the spinner while `isConfirming`. */
  confirmingLabel?: string;
  confirmVariant?: "default" | "destructive";
  children?: ReactNode;
}

export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onOpenChange,
  confirmDisabled = false,
  isConfirming = false,
  confirmingLabel = "جاري التنفيذ...",
  confirmVariant = "default",
  children,
}: ConfirmationModalProps) {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";

  const handleConfirm = () => {
    // Guards the handler itself, not just the Button's disabled prop — closes the
    // render-cycle window where a second click could land before the button
    // visually disables.
    if (isConfirming) return;
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* dir follows the locale: text and X on the right in Arabic, on the left side mirrored in English.
          The shared dialog's own X is pinned to the physical right, so we render our own at the end side. */}
      <DialogContent className="sm:max-w-md" dir={dir} showCloseButton={false}>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={isConfirming}
          aria-label={cancelLabel}
          className="absolute end-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="text-start sm:text-start pe-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={confirmDisabled || isConfirming}
            className="min-w-28"
          >
            {isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {confirmingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
