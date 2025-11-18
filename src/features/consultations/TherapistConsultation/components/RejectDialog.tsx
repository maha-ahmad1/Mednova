"use client";

import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: RejectDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirm = async () => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }

    try {
      await onConfirm(rejectionReason);
      setRejectionReason("");
    } catch (error) {
      console.log("[v0] Error in reject dialog:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className=" mr-2 mt-2">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            {/* <AlertTriangle className="w-5 h-5" /> */}
            تأكيد إلغاء الاستشارة
          </DialogTitle>
          {/* <DialogDescription className="text-right">
            هل أنت متأكد من رفض طلب الاستشارة؟ يرجى إدخال سبب الرفض وسيتم إعلام المريض به.
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 my-2">
            <Label htmlFor="rejectionReason" className="text-right block">
              سبب الإلغاء
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="أدخل سبب الإلغاء 
 الاستشارة..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={isLoading}
              className="min-h-[100px] resize-none text-right"
              dir="rtl"
            />
            <p className="text-xs text-gray-500 text-right">
              هذا السبب سيتم إرساله للمريض
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setRejectionReason("");
            }}
            disabled={isLoading}
            className="flex-1"
          >
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !rejectionReason.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                جاري الرفض...
              </>
            ) : (
              <>
                {/* <X className="w-4 h-4 ml-2" /> */}
                تأكيد الرفض
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
