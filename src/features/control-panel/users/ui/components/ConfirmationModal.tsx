import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
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
  const handleConfirm = () => {
    // Guards the handler itself, not just the Button's disabled prop — closes the
    // render-cycle window where a second click could land before the button
    // visually disables.
    if (isConfirming) return;
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
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
