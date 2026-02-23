"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const rejectUserSchema = z.object({
  reason: z.string().trim().min(1, "سبب الرفض مطلوب"),
});

type RejectUserFormValues = z.infer<typeof rejectUserSchema>;

interface RejectUserModalProps {
  open: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function RejectUserModal({
  open,
  isLoading = false,
  onOpenChange,
  onConfirm,
}: RejectUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectUserFormValues>({
    resolver: zodResolver(rejectUserSchema),
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset({ reason: "" });
    }
  }, [open, reset]);

  const onSubmit = (values: RejectUserFormValues) => {
    onConfirm(values.reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>رفض المستخدم</DialogTitle>
          <DialogDescription>
            يرجى كتابة سبب الرفض. سيتم إرسال السبب مع تحديث الحالة.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Textarea
            placeholder="اكتب سبب الرفض"
            className="min-h-[120px] resize-none"
            disabled={isLoading}
            {...register("reason")}
          />
          {errors.reason && (
            <p className="text-sm text-destructive">{errors.reason.message}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
