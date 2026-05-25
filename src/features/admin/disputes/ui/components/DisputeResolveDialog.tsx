"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useResolveDispute } from "../../hooks/useResolveDispute";

const resolveSchema = z.object({
  resolution: z.enum(["release", "refund"] as const, {
    message: "يجب اختيار القرار",
  }),
  admin_note: z
    .string()
    .trim()
    .min(10, "يجب أن تحتوي الملاحظة على 10 أحرف على الأقل")
    .max(1000, "يجب ألا تتجاوز الملاحظة 1000 حرف"),
});

type ResolveFormValues = z.infer<typeof resolveSchema>;

interface DisputeResolveDialogProps {
  disputeId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisputeResolveDialog({
  disputeId,
  open,
  onOpenChange,
}: DisputeResolveDialogProps) {
  const { mutateAsync, isPending } = useResolveDispute(disputeId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResolveFormValues>({
    resolver: zodResolver(resolveSchema),
  });

  const handleClose = () => {
    if (isPending) return;
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: ResolveFormValues) => {
    await mutateAsync(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>حل النزاع</DialogTitle>
          <DialogDescription>
            اختر القرار وأضف ملاحظة قبل التأكيد.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>القرار</Label>
            <Controller
              control={control}
              name="resolution"
              render={({ field }) => (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange("release")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      field.value === "release"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-border bg-background text-foreground hover:bg-muted/40",
                    )}
                  >
                    الإفراج عن الأموال للمستشار
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("refund")}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      field.value === "refund"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-border bg-background text-foreground hover:bg-muted/40",
                    )}
                  >
                    استرداد المبلغ للمريض
                  </button>
                </div>
              )}
            />
            {errors.resolution && (
              <p className="text-xs text-destructive">{errors.resolution.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_note">ملاحظة المسؤول</Label>
            <Textarea
              id="admin_note"
              placeholder="صف سبب القرار..."
              rows={4}
              {...register("admin_note")}
            />
            {errors.admin_note && (
              <p className="text-xs text-destructive">{errors.admin_note.message}</p>
            )}
          </div>

          <DialogFooter className="flex-row-reverse gap-2 sm:gap-0">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ الحل...
                </>
              ) : (
                "تأكيد القرار"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
